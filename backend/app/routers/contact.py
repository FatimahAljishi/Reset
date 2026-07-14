from fastapi import APIRouter, HTTPException
import resend #type:ignore
from app.schemas import ContactForm
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

router = APIRouter(
    prefix="/contact",
    tags=["Contact"],
)

@router.post("/")
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