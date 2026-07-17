import html
import os
from typing import Any

import httpx
import resend

from app.models import Order, OrderItem
from app.services.clerk_service import get_clerk_user, get_customer_name
import asyncio
import logging
from requests.exceptions import ConnectionError, Timeout
from resend.exceptions import ResendError


logger = logging.getLogger(__name__)


async def send_with_retry(
    params: dict,
    idempotency_key: str,
    attempts: int = 3,
) -> None:
    last_error: Exception | None = None

    options: resend.Emails.SendOptions = {
        "idempotency_key": idempotency_key,
    }

    for attempt in range(attempts):
        try:
            await asyncio.to_thread(
                resend.Emails.send,
                params,
                options,
            )
            return

        except (
            ConnectionError,
            Timeout,
            OSError,
            resend.exceptions.ResendError,
        ) as error:
            last_error = error

            logger.warning(
                "Email attempt %s/%s failed: %s",
                attempt + 1,
                attempts,
                error,
            )

            if attempt < attempts - 1:
                await asyncio.sleep(2 ** attempt)

    if last_error:
        raise last_error


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

    await send_with_retry(
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
        },
        idempotency_key=f"paid-order-email-{order.id}",
    )


def build_customer_items_html_ar(items: list[OrderItem]) -> str:
    rows: list[str] = []

    for item in items:
        service_name = html.escape(item.service_title_ar)
        plan_name = html.escape(item.plan_title_ar)

        item_total_sar = (
            item.unit_price_halalas * item.quantity
        ) / 100

        quantity_text = (
            f" × {item.quantity}"
            if item.quantity > 1
            else ""
        )

        rows.append(
            f"""
            <tr>
                <td
                    style="
                        padding: 14px 0;
                        border-bottom: 1px solid #e9e3d7;
                        text-align: right;
                    "
                >
                    <strong style="color: #465e2c;">
                        {service_name}
                    </strong>

                    <div
                        style="
                            margin-top: 4px;
                            color: #6f6b62;
                            font-size: 14px;
                        "
                    >
                        {plan_name}{quantity_text}
                    </div>
                </td>

                <td
                    dir="ltr"
                    style="
                        padding: 14px 0;
                        border-bottom: 1px solid #e9e3d7;
                        text-align: left;
                        white-space: nowrap;
                    "
                >
                    {item_total_sar:,.2f} ر.س
                </td>
            </tr>
            """
        )

    return "".join(rows)


def build_customer_items_html_en(items: list[OrderItem]) -> str:
    rows: list[str] = []

    for item in items:
        service_name = html.escape(item.service_title_en)
        plan_name = html.escape(item.plan_title_en)

        item_total_sar = (
            item.unit_price_halalas * item.quantity
        ) / 100

        quantity_text = (
            f" × {item.quantity}"
            if item.quantity > 1
            else ""
        )

        rows.append(
            f"""
            <tr>
                <td
                    style="
                        padding: 14px 0;
                        border-bottom: 1px solid #e9e3d7;
                    "
                >
                    <strong style="color: #465e2c;">
                        {service_name}
                    </strong>

                    <div
                        style="
                            margin-top: 4px;
                            color: #6f6b62;
                            font-size: 14px;
                        "
                    >
                        {plan_name}{quantity_text}
                    </div>
                </td>

                <td
                    style="
                        padding: 14px 0;
                        border-bottom: 1px solid #e9e3d7;
                        text-align: right;
                        white-space: nowrap;
                    "
                >
                    {item_total_sar:,.2f} SAR
                </td>
            </tr>
            """
        )

    return "".join(rows)


async def send_customer_confirmation_email(
    order: Order,
    items: list[OrderItem],
) -> None:
    resend_api_key = os.getenv("RESEND_API_KEY")

    email_from = os.getenv(
        "EMAIL_FROM",
        "Reset by Zainab <onboarding@resend.dev>",
    )

    if not resend_api_key:
        raise RuntimeError(
            "RESEND_API_KEY is not configured."
        )

    if not order.customer_email:
        raise RuntimeError(
            "The order does not contain a customer email."
        )

    resend.api_key = resend_api_key

    safe_customer_name = html.escape(
        order.customer_name or "عميلة Reset"
    )

    safe_customer_email = html.escape(
        order.customer_email
    )

    safe_phone = html.escape(order.phone)

    safe_payment_id = html.escape(
        order.payment_id or "غير متوفر"
    )

    total_sar = order.total_halalas / 100

    items_html_ar = build_customer_items_html_ar(items)
    items_html_en = build_customer_items_html_en(items)

  

    await send_with_retry(
        {
            "from": email_from,
            "to": [safe_customer_email],
            "subject": (
                "تم استلام دفعتكِ | Payment received — "
                "Reset by Zainab 🌿"
            ),
            "html": f"""
                <div
                    style="
                        background: #f7f3e9;
                        padding: 32px 16px;
                        font-family: Arial, sans-serif;
                        color: #333333;
                    "
                >
                    <div
                        style="
                            max-width: 600px;
                            margin: 0 auto;
                            background: #fffdf8;
                            border: 1px solid #ded7c8;
                            border-radius: 20px;
                            overflow: hidden;
                        "
                    >
                        <div
                            style="
                                padding: 28px;
                                background: #465e2c;
                                color: white;
                                text-align: center;
                            "
                        >
                            <h1
                                style="
                                    margin: 0;
                                    font-family: Georgia, serif;
                                    font-size: 28px;
                                "
                            >
                                تم استلام دفعتكِ بنجاح
                            </h1>

                            <p
                                style="
                                    margin: 10px 0 0;
                                    opacity: 0.9;
                                "
                            >
                              رحلتكِ مع ريسيت تبدأ من هنا
                            </p>
                        </div>

                        <div style="padding: 28px;">
                            <!-- Arabic section -->
                            <div
                                dir="rtl"
                                lang="ar"
                                style="
                                    text-align: right;
                                    line-height: 1.8;
                                "
                            >
                                <p style="margin-top: 0;">
                                    مرحباً
                                    <strong>{safe_customer_name}</strong>،
                                </p>

                                <p>
                                    شكراً لاختياركِ
                                    <strong>Reset by Zainab</strong>.
                                   تم استلام طلبكِ وتأكيد عملية الدفع بنجاح.
                                </p>

                                <h2
                                    style="
                                        margin-top: 30px;
                                        color: #465e2c;
                                        font-family: Georgia, serif;
                                        font-size: 20px;
                                    "
                                >
                                    تفاصيل الطلب
                                </h2>

                                <table
                                    dir="rtl"
                                    style="
                                        width: 100%;
                                        border-collapse: collapse;
                                    "
                                >
                                    {items_html_ar}
                                </table>

                                <div
                                    style="
                                        display: flex;
                                        justify-content: space-between;
                                        margin-top: 22px;
                                        padding-top: 18px;
                                        border-top: 2px solid #465e2c;
                                        color: #465e2c;
                                        font-size: 18px;
                                    "
                                >
                                    <strong>الإجمالي</strong>

                                    <strong dir="ltr">
                                        {total_sar:,.2f} ر.س
                                    </strong>
                                </div>

                                <div
                                    style="
                                        margin-top: 28px;
                                        padding: 18px;
                                        background: #f3efe4;
                                        border-radius: 14px;
                                    "
                                >
                                    <p
                                        style="
                                            margin: 0 0 8px;
                                            color: #465e2c;
                                            font-weight: bold;
                                        "
                                    >
                                        ما الخطوة التالية؟
                                    </p>

                                    <p style="margin: 0;">
                                        سنتواصل معكِ قريباً
                                        على رقم الجوال أدناه لترتيب
                                        مواعيد الجلسات.
                                    </p>

                                    <p
                                        dir="ltr"
                                        style="
                                            margin: 12px 0 0;
                                            font-weight: bold;
                                            text-align: right;
                                        "
                                    >
                                        {safe_phone}
                                    </p>
                                </div>

                                <p style="margin-top: 28px;">
                                    يسعدنا أن نكون جزءاً من رحلتكِ
                                    نحو العافية والحركة المتوازنة.
                                </p>

                                <p
                                    style="
                                        margin-bottom: 0;
                                        color: #465e2c;
                                        font-family: Georgia, serif;
                                        font-weight: bold;
                                    "
                                >
                                    تحركي بهدف.<br>
                                    وعيشي بتوازن.
                                </p>

                                <p
                                    style="
                                        margin-top: 22px;
                                        color: #77736b;
                                        font-size: 12px;
                                    "
                                >
                                    رقم الطلب: #{order.id}<br>
                                    رقم عملية الدفع:
                                    <span dir="ltr">
                                        {safe_payment_id}
                                    </span>
                                </p>
                            </div>

                            <div
                                style="
                                    margin: 32px 0;
                                    border-top: 1px solid #ded7c8;
                                "
                            ></div>

                            <!-- English section -->
                            <div
                                dir="ltr"
                                lang="en"
                                style="
                                    text-align: left;
                                    line-height: 1.7;
                                "
                            >
                                <h2
                                    style="
                                        margin-top: 0;
                                        color: #465e2c;
                                        font-family: Georgia, serif;
                                        font-size: 22px;
                                    "
                                >
                                    Payment received
                                </h2>

                                <p>
                                    Hi
                                    <strong>{safe_customer_name}</strong>,
                                </p>

                                <p>
                                    Thank you for choosing
                                    <strong>Reset by Zainab</strong>.
                                   We've successfully received your payment and your order has been confirmed.
                                </p>

                                <h2
                                    style="
                                        margin-top: 30px;
                                        color: #465e2c;
                                        font-family: Georgia, serif;
                                        font-size: 20px;
                                    "
                                >
                                    Your order
                                </h2>

                                <table
                                    style="
                                        width: 100%;
                                        border-collapse: collapse;
                                    "
                                >
                                    {items_html_en}
                                </table>

                                <div
                                    style="
                                        display: flex;
                                        justify-content: space-between;
                                        margin-top: 22px;
                                        padding-top: 18px;
                                        border-top: 2px solid #465e2c;
                                        color: #465e2c;
                                        font-size: 18px;
                                    "
                                >
                                    <strong>Total</strong>

                                    <strong>
                                        {total_sar:,.2f} SAR
                                    </strong>
                                </div>

                                <div
                                    style="
                                        margin-top: 28px;
                                        padding: 18px;
                                        background: #f3efe4;
                                        border-radius: 14px;
                                    "
                                >
                                    <p
                                        style="
                                            margin: 0 0 8px;
                                            color: #465e2c;
                                            font-weight: bold;
                                        "
                                    >
                                        What happens next?
                                    </p>

                                    <p style="margin: 0;">
                                        We will contact you shortly
                                        using the phone number below to
                                        arrange your sessions.
                                    </p>

                                    <p
                                        dir="ltr"
                                        style="
                                            margin: 12px 0 0;
                                            font-weight: bold;
                                        "
                                    >
                                        {safe_phone}
                                    </p>
                                </div>

                                <p style="margin-top: 28px;">
                                    We are excited to be part of your
                                    wellness journey.
                                </p>

                                <p
                                    style="
                                        margin-bottom: 0;
                                        color: #465e2c;
                                        font-family: Georgia, serif;
                                        font-weight: bold;
                                    "
                                >
                                    Move with purpose.<br>
                                    Live with balance.
                                </p>

                                <p
                                    style="
                                        margin-top: 22px;
                                        color: #77736b;
                                        font-size: 12px;
                                    "
                                >
                                    Order #{order.id}<br>
                                    Payment ID: {safe_payment_id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            """,
        },
        idempotency_key=f"customer-order-confirmation/{order.id}",
    )