from typing import Optional
from sqlmodel import SQLModel, Field, Relationship  # type: ignore
from datetime import datetime, timezone
from enum import Enum


class FulfillmentType(str, Enum):
    SESSION = "session"
    DIGITAL = "digital"


class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    EXPIRED = "expired"


class FulfillmentStatus(str, Enum):
    NEEDS_CONTACT = "needs_contact"
    CONTACTED = "contacted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    NEEDS_DELIVERY = "needs_delivery"
    DELIVERED = "delivered"


class Service(SQLModel, table=True):
    __tablename__ = "service"
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True, max_length=100)
    title_en: str = Field(max_length=200)
    title_ar: str = Field(max_length=200)
    fulfillment_type: FulfillmentType = Field(default=FulfillmentType.SESSION)
    plans: list["ServicePlan"] = Relationship(back_populates="service")


class ServicePlan(SQLModel, table=True):
    __tablename__ = "service_plan"
    id: Optional[int] = Field(default=None, primary_key=True)
    service_id: int = Field(foreign_key="service.id")
    code: str = Field(index=True, unique=True)
    title_en: str = Field(max_length=200)
    title_ar: str = Field(max_length=200)
    sessions: Optional[int] = Field(default=None)
    price_halalas: int = Field(gt=0)
    sort_order: int = Field(default=0)
    service: Optional[Service] = Relationship(back_populates="plans")


class Order(SQLModel, table=True):
    __tablename__ = "order"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[str] = Field(default=None, index=True, max_length=255)
    customer_name: str = Field(max_length=255)
    customer_email: str = Field(default=None, max_length=255)
    phone: str = Field(max_length=20)
    status: OrderStatus = Field(default=OrderStatus.PENDING, index=True)
    total_halalas: int = Field(gt=0)
    payment_id: Optional[str] = Field(
        default=None, index=True, unique=True, max_length=255
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    items: list["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_item"
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    service_plan_id: int = Field(foreign_key="service_plan.id", index=True)
    quantity: int = Field(default=1, gt=0)
    unit_price_halalas: int = Field(gt=0)
    sessions: Optional[int] = Field(default=None)
    fulfillment_status: FulfillmentStatus = Field(
        default=FulfillmentStatus.NEEDS_CONTACT
    )
    service_title_en: str = Field(max_length=200)
    service_title_ar: str = Field(max_length=200)
    plan_title_en: str = Field(max_length=200)
    plan_title_ar: str = Field(max_length=200)
    plan_pdf_key: Optional[str] = Field(default=None, max_length=500)
    plan_pdf_name: Optional[str] = Field(default=None)
    plan_uploaded_at: Optional[datetime] = Field(default=None)
    order: Optional[Order] = Relationship(back_populates="items")
    training_package: Optional["TrainingPackage"] = Relationship()


class TrainingPackage(SQLModel, table=True):
    __tablename__ = "training_package"
    id: Optional[int] = Field(default=None, primary_key=True)
    order_item_id: int = Field(foreign_key="order_item.id", unique=True, index=True)
    total_sessions: int = Field(gt=0)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    sessions: list["TrainingSession"] = Relationship(back_populates="training_package")


class TrainingSession(SQLModel, table=True):
    __tablename__ = "training_session"
    id: Optional[int] = Field(default=None, primary_key=True)
    training_package_id: int = Field(foreign_key="training_package.id", index=True)
    session_number: int = Field(gt=0)
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    notes: Optional[str] = Field(default=None)
    training_package: Optional["TrainingPackage"] = Relationship(
        back_populates="sessions"
    )
