from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import OrderCreate, OrderRead, OrderItemRead, OrderItemCreate
import os
from dotenv import load_dotenv
from app.database import get_session
from sqlmodel import Session, select
from app.models import Order, OrderItem, ServicePlan, Service
from app.auth import get_current_user_id

load_dotenv()


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, user_id: str = Depends(get_current_user_id),
                 session: Session = Depends(get_session)):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="The order must contain at least one item.")
    total_halalas = 0
    order_items: list[OrderItem] = []
    for requested_item in order_data.items:
        plan = session.get(ServicePlan, requested_item.plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail=(f"Service plan {requested_item.plan_id} was not found."))
        service = session.get(Service, plan.service_id)

        if not service:
            raise HTTPException(status_code=404, detail="The service connected to this plan was not found.")
        item_total = (plan.price_halalas * requested_item.quantity)
        total_halalas += item_total
        order_items.append(
            OrderItem(
                service_plan_id=plan.id,
                quantity=requested_item.quantity,
                unit_price_halalas=plan.price_halalas,
                sessions=plan.sessions,
                service_title_en=service.title_en,
                service_title_ar=service.title_ar,
                plan_title_en=plan.title_en,
                plan_title_ar=plan.title_ar,
            )
        )

    order = Order(
        phone=order_data.phone,
        status="pending",
        total_halalas=total_halalas,
        user_id=user_id,
    )

    session.add(order)
    session.commit()
    session.refresh(order)

    for order_item in order_items:
        order_item.order_id = order.id
        session.add(order_item)

    session.commit()
    session.refresh(order)

    return order

@router.get("/me", response_model=list[OrderRead])
def get_my_orders(user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    statement = select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
    orders = session.exec(statement).all()
    return orders