from fastapi import FastAPI #type:ignore
import os
import resend #type:ignore
from pydantic import BaseModel, EmailStr, Field 
from fastapi.middleware.cors import CORSMiddleware #type:ignore 
from dotenv import load_dotenv
from fastapi import HTTPException #type:ignore

load_dotenv()

app = FastAPI(title="Reset API")

resend.api_key = os.getenv("RESEND_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://reset-by-zainab.vercel.app/"],
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