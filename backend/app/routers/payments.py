from fastapi import APIRouter, HTTPException
from app.schemas import PaymentVerificationRequest
import os
from dotenv import load_dotenv
import httpx

load_dotenv()

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post("/verify")
async def verify_payment(data: PaymentVerificationRequest):
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

    is_paid = payment.get("status") == "paid"
    amount_matches = payment.get("amount") == data.expected_amount
    currency_matches = payment.get("currency") == "SAR"

    if not is_paid:
        raise HTTPException(
            status_code=400,
            detail="Payment was not successful.",
        )

    if not amount_matches:
        raise HTTPException(
            status_code=400,
            detail="Payment amount does not match the order.",
        )

    if not currency_matches:
        raise HTTPException(
            status_code=400,
            detail="Payment currency does not match the order.",
        )

    return {
        "verified": True,
        "payment_id": payment.get("id"),
        "status": payment.get("status"),
        "amount": payment.get("amount"),
        "currency": payment.get("currency"),
    }