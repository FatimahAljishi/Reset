from requests import session

from app.schemas import PaymentVerificationRequest
import os
from dotenv import load_dotenv
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Order, OrderItem
from app.services.order_notifications import send_paid_order_email
import logging

load_dotenv()
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post("/verify")
async def verify_payment(
    data: PaymentVerificationRequest,
    session: Session = Depends(get_session),
):
    order = session.get(Order, data.order_id)

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found.",
        )

    # Makes repeated verification safe.
    if order.status == "paid":
        if order.payment_id != data.payment_id:
            raise HTTPException(
                status_code=400,
                detail="This order was paid using another payment.",
            )

        return {
            "verified": True,
            "order_id": order.id,
            "payment_id": order.payment_id,
            "status": order.status,
            "amount": order.total_halalas,
            "currency": "SAR",
        }

    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="This order cannot be paid.",
        )

    secret_key = os.getenv("MOYASAR_SECRET_KEY")

    if not secret_key:
        raise HTTPException(
            status_code=500,
            detail="Moyasar secret key is not configured.",
        )

    payment_url = (
        f"https://api.moyasar.com/v1/payments/{data.payment_id}"
    )

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                payment_url,
                auth=(secret_key, ""),
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to Moyasar.",
        )

    if response.status_code == 404:
        raise HTTPException(
            status_code=404,
            detail="Payment not found.",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="Could not verify payment.",
        )

    payment = response.json()

    if payment.get("status") != "paid":
        raise HTTPException(
            status_code=400,
            detail="Payment was not successful.",
        )

    if payment.get("amount") != order.total_halalas:
        raise HTTPException(
            status_code=400,
            detail="Payment amount does not match the order.",
        )

    if payment.get("currency") != "SAR":
        raise HTTPException(
            status_code=400,
            detail="Payment currency does not match the order.",
        )

    metadata = payment.get("metadata") or {}

    if str(metadata.get("order_id")) != str(order.id):
        raise HTTPException(
            status_code=400,
            detail="Payment does not belong to this order.",
        )

    order.status = "paid"
    order.payment_id = payment.get("id")

    session.add(order)
    session.commit()
    session.refresh(order)

    items_statement = select(OrderItem).where(
        OrderItem.order_id == order.id
    )

    order_items = list(session.exec(items_statement).all())

    try:
        await send_paid_order_email(
            order=order,
            items=order_items,
        )
    except Exception:
        logger.exception(
            "Order %s was paid, but the trainer email could not be sent.",
            order.id,
        )

    return {
        "verified": True,
        "order_id": order.id,
        "payment_id": order.payment_id,
        "status": order.status,
        "amount": order.total_halalas,
        "currency": payment.get("currency"),
    }