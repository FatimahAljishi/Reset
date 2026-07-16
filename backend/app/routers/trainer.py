from fastapi import APIRouter, Depends
from app.auth import get_current_trainer_id
from app.schemas import TrainerOrder, TrainerOrderItem
from app.database import get_session
from sqlmodel import Session, select
from app.models import Order, OrderItem
from app.services.clerk_service import get_clerk_user, get_customer_name


router = APIRouter(
    prefix="/trainer",
    tags=["Trainer"],
)

@router.get(
    "/orders",
    response_model=list[TrainerOrder],
)
def get_trainer_orders(
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    statement = (
    select(Order)
    .order_by(Order.created_at.desc())
)

    orders = session.exec(statement).all()

    trainer_orders: list[TrainerOrder] = []

    for order in orders:
        items: list[TrainerOrderItem] = []
        for item in order.items:
            items.append(
                TrainerOrderItem(
                    service=item.service_title_en,
                    plan=item.plan_title_en,
                    quantity=item.quantity,
                )
            )

        trainer_orders.append(
            TrainerOrder(
                id=order.id,
                customer_name=order.customer_name,
                customer_email=order.customer_email,
                phone=order.phone,
                status=order.status,
                total_halalas=order.total_halalas,
                created_at=order.created_at,
                items=items,
            )
        )

    return trainer_orders