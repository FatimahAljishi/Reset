import html
import os
from typing import Any

import httpx
import resend

from app.models import Order, OrderItem
from app.services.clerk_service import get_clerk_user, get_customer_name


def build_items_html(items: list[OrderItem]) -> str:
    item_rows = []

    for item in items:
        service_name = html.escape(item.service_title_en)
        plan_name = html.escape(item.plan_title_en)

        unit_price_sar = item.unit_price_halalas / 100
        item_total_sar = unit_price_sar * item.quantity

        quantity_text = ""

        if item.quantity > 1:
            quantity_text = f" × {item.quantity}"

        item_rows.append(
            f"""
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e8e2d4;">
                    <strong>{service_name}</strong><br>
                    <span style="color: #666;">
                        {plan_name}{quantity_text}
                    </span>
                </td>

                <td
                    style="
                        padding: 12px 0;
                        border-bottom: 1px solid #e8e2d4;
                        text-align: right;
                        white-space: nowrap;
                    "
                >
                    {item_total_sar:,.2f} SAR
                </td>
            </tr>
            """
        )

    return "".join(item_rows)


async def send_paid_order_email(
    order: Order,
    items: list[OrderItem],
) -> None:
    resend_api_key = os.getenv("RESEND_API_KEY")
    trainer_email = os.getenv("TRAINER_EMAIL")
    email_from = os.getenv(
        "EMAIL_FROM",
        "Reset by Zainab <onboarding@resend.dev>",
    )

    if not resend_api_key:
        raise RuntimeError("RESEND_API_KEY is not configured.")

    if not trainer_email:
        raise RuntimeError("TRAINER_EMAIL is not configured.")

    if not order.user_id:
        customer_name = "Reset customer"
    else:
        clerk_user = await get_clerk_user(order.user_id)
        customer_name = get_customer_name(clerk_user)

    safe_customer_name = html.escape(customer_name)
    safe_phone = html.escape(order.phone)
    safe_payment_id = html.escape(order.payment_id or "Not available")

    total_sar = order.total_halalas / 100
    items_html = build_items_html(items)

    resend.api_key = resend_api_key

    resend.Emails.send(
        {
            "from": email_from,
            "to": [trainer_email],
            "subject": f"New paid Reset order #{order.id}",
            "html": f"""
                <div
                    style="
                        max-width: 600px;
                        margin: auto;
                        padding: 24px;
                        background: #fffdf8;
                        color: #333;
                        font-family: Arial, sans-serif;
                    "
                >
                    <h1 style="color: #465e2c; margin-top: 0;">
                        New paid order 🎉
                    </h1>

                    <p>
                        A customer has completed payment for a Reset order.
                    </p>

                    <table
                        style="
                            width: 100%;
                            margin: 24px 0;
                            border-collapse: collapse;
                        "
                    >
                        <tr>
                            <td style="padding: 8px 0; color: #666;">
                                Client
                            </td>
                            <td style="padding: 8px 0; text-align: right;">
                                <strong>{safe_customer_name}</strong>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 8px 0; color: #666;">
                                Phone
                            </td>
                            <td
                                dir="ltr"
                                style="padding: 8px 0; text-align: right;"
                            >
                                <strong>{safe_phone}</strong>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 8px 0; color: #666;">
                                Order
                            </td>
                            <td style="padding: 8px 0; text-align: right;">
                                <strong>#{order.id}</strong>
                            </td>
                        </tr>
                    </table>

                    <h2 style="color: #465e2c;">
                        Purchased services
                    </h2>

                    <table
                        style="
                            width: 100%;
                            border-collapse: collapse;
                        "
                    >
                        {items_html}
                    </table>

                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            margin-top: 24px;
                            padding-top: 16px;
                            border-top: 2px solid #465e2c;
                        "
                    >
                        <strong>Total</strong>
                        <strong>{total_sar:,.2f} SAR</strong>
                    </div>

                    <p style="margin-top: 24px; color: #777; font-size: 13px;">
                        Payment ID: {safe_payment_id}
                    </p>
                </div>
            """,
        }
    )