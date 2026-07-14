from typing import Optional
from sqlmodel import SQLModel, Field, Relationship #type: ignore

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
