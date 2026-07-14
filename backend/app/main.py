from fastapi import FastAPI, HTTPException #type:ignore
import os
import resend #type:ignore
from pydantic import BaseModel, EmailStr, Field 
from fastapi.middleware.cors import CORSMiddleware #type:ignore 
from dotenv import load_dotenv
import httpx

load_dotenv()

app = FastAPI(title="Reset API")

resend.api_key = os.getenv("RESEND_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://reset-by-zainab.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str = Field
    phone: str
    email: EmailStr
    city: str = Field
    goal: str = Field
    message: str = Field

@app.post("/contact")
def contact(data: ContactForm):
    try:
        resend.Emails.send({
            "from": "Reset by Zainab <onboarding@resend.dev>",
            "to": ["fatimahjishi@hotmail.com"],
            "reply_to": data.email,
            "subject": f"New Contact Form from {data.name}",
            "html": f"""
            <h2>New Contact Form</h2>

            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>City:</strong> {data.city}</p>
            <p><strong>Fitness Goal:</strong> {data.goal}</p>

            <hr>

            <p>{data.message.replace("\n", "<br>")}</p>
            """
        })

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class PaymentVerificationRequest(BaseModel):
    payment_id: str
    expected_amount: int  # Amount in halalas


@app.post("/payments/verify")
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