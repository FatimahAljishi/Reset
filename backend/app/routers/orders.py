from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import OrderCreate, OrderRead, OrderItemRead, OrderItemCreate
import os
from dotenv import load_dotenv
from app.database import get_session
from sqlmodel import Session, select
from app.models import Order, OrderItem, ServicePlan

load_dotenv()


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, session: Session = Depends(get_session)):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="The order must contain at least one item.")
    total_halalas = 0
    order_items: list[OrderItem] = []
    for requested_item in order_data.items:
        plan = session.get(ServicePlan, requested_item.plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail=(f"Service plan {requested_item.plan_id} was not found."))
        item_total = (plan.price_halalas * requested_item.quantity)
        total_halalas += item_total
        order_items.append(
            OrderItem(
                service_plan_id=plan.id,
                quantity=requested_item.quantity,
                unit_price_halalas=plan.price_halalas,
                sessions=plan.sessions,
            )
        )

    order = Order(
        phone=order_data.phone,
        status="pending",
        total_halalas=total_halalas,
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