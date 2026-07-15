from sqlmodel import SQLModel, Field #type: ignore
from typing import Optional
from pydantic import EmailStr
from datetime import datetime


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
    order_id: int

class OrderItemCreate(SQLModel):
    plan_id: int
    quantity: int = Field(default=1, gt=0)

class OrderCreate(SQLModel):
    phone: str
    items: list[OrderItemCreate]

class OrderItemRead(SQLModel):
    id: int
    service_plan_id: int
    quantity: int
    unit_price_halalas: int
    sessions: Optional[int]
    service_title_en: str
    service_title_ar: str
    plan_title_en: str
    plan_title_ar: str


class OrderRead(SQLModel):
    id: int
    phone: str
    status: str
    total_halalas: int
    created_at: datetime
    items: list[OrderItemRead] = []