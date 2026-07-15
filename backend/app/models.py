from typing import Optional
from sqlmodel import SQLModel, Field, Relationship #type: ignore
from datetime import datetime, timezone

class Service(SQLModel, table=True):
    __tablename__ = "service"
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True, max_length=100)
    title_en: str = Field(max_length=200)
    title_ar: str = Field(max_length=200)
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
    phone: str = Field(max_length=20)
    status: str = Field(default="pending", index=True, max_length=20)
    total_halalas: int = Field(gt=0)
    payment_id: Optional[str] = Field(default=None, index=True, unique=True, max_length=255)
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
    order: Optional[Order] = Relationship(back_populates="items")

