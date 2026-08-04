from sqlmodel import SQLModel, Field  # type: ignore
from typing import Optional
from pydantic import EmailStr
from datetime import datetime
from app.models import FulfillmentStatus


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
    customer_name: str
    customer_email: str
    status: str
    total_halalas: int
    created_at: datetime
    items: list[OrderItemRead] = []


class TrainerOrderItem(SQLModel):
    id: int
    package_id: Optional[int] = None
    service: str
    plan: str
    quantity: int
    fulfillment_status: FulfillmentStatus


class TrainerOrder(SQLModel):
    id: int
    customer_name: str
    customer_email: str
    phone: str
    status: str
    total_halalas: int
    created_at: datetime
    items: list[TrainerOrderItem]


class ActiveClient(SQLModel):
    package_id: Optional[int] = None
    order_id: int
    order_item_id: int
    customer_name: str
    service: str
    plan: str
    sessions_completed: Optional[int] = None
    total_sessions: Optional[int] = None
    sessions_remaining: Optional[int] = None
    progress: str
    progress_percentage: Optional[float] = None
    plan_pdf_url: Optional[str] = None
    plan_pdf_name: Optional[str] = None
    plan_uploaded_at: Optional[datetime] = None


class TrainerDashboard(SQLModel):
    needs_action: list[ActionItem]
    active_clients: list[ActiveClient]
    recent_orders: list[TrainerOrder]


class MessageResponse(SQLModel):
    message: str


class TrainingSessionResponse(SQLModel):
    session_number: int
    sessions_completed: int
    sessions_remaining: int
    completed: bool


class ActionItem(SQLModel):
    order_item_id: int
    order_id: int
    customer_name: str
    phone: str
    created_at: datetime
    service: str
    plan: str
    fulfillment_status: FulfillmentStatus


class ActivePlan(SQLModel):
    package_id: Optional[int] = None
    order_id: int
    order_item_id: int
    service: str
    service_ar: str
    plan: str
    plan_ar: str
    sessions_completed: Optional[int] = None
    total_sessions: Optional[int] = None
    sessions_remaining: Optional[int] = None
    progress_percentage: Optional[float] = None
    fulfillment_status: FulfillmentStatus
    plan_pdf_url: Optional[str] = None
    plan_pdf_name: Optional[str] = None


class JourneyDashboard(SQLModel):
    active_plans: list[ActivePlan]
