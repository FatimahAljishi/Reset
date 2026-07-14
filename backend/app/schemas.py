from sqlmodel import SQLModel #type: ignore
from typing import Optional
from pydantic import EmailStr

class ServicePlanResponse(SQLModel):
    id: int
    code: str
    title_en: str
    title_ar: str 
    sessions: Optional[int] 
    price_halalas: int 
    sort_order: int

class ServiceResponse(SQLModel):
    id: int
    slug: str
    title_en: str
    title_ar: str
    plans: list[ServicePlanResponse] = []

class ContactForm(SQLModel):
    name: str 
    phone: str
    email: EmailStr
    city: str 
    goal: str 
    message: str 

class PaymentVerificationRequest(SQLModel):
    payment_id: str
    expected_amount: int  # Amount in halalas