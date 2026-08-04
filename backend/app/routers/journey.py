from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.auth import get_current_user_id
from app.database import get_session
from app.models import (
    Order,
    OrderItem,
    TrainingPackage,
    OrderStatus,
)
from app.schemas import (
    JourneyDashboard,
    ActivePlan,
)

router = APIRouter(
    prefix="/journey",
    tags=["Journey"],
)


@router.get(
    "",
    response_model=JourneyDashboard,
)
def get_journey(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    orders = session.exec(
        select(Order).where(
            Order.user_id == user_id,
            Order.status == OrderStatus.PAID,
        )
    ).all()

    active_plans: list[ActivePlan] = []

    for order in orders:
        for item in order.items:
            package = session.exec(
                select(TrainingPackage).where(TrainingPackage.order_item_id == item.id)
            ).first()

            if package:
                if package.completed_at is not None:
                    continue

                sessions_completed = len(package.sessions)
                sessions_remaining = package.total_sessions - sessions_completed
                progress_percentage = (
                    sessions_completed / package.total_sessions
                ) * 100

            active_plans.append(
                ActivePlan(
                    package_id=package.id if package else None,
                    order_id=order.id,
                    order_item_id=item.id,
                    service=item.service_title_en,
                    service_ar=item.service_title_ar,
                    plan=item.plan_title_en,
                    plan_ar=item.plan_title_ar,
                    sessions_completed=sessions_completed if package else None,
                    total_sessions=package.total_sessions if package else None,
                    sessions_remaining=sessions_remaining if package else None,
                    progress_percentage=progress_percentage if package else None,
                    fulfillment_status=item.fulfillment_status,
                    plan_pdf_url=item.plan_pdf_url,
                )
            )

    return JourneyDashboard(
        active_plans=active_plans,
    )
