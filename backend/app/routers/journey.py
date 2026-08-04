from fastapi import APIRouter, Depends, HTTPException
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
from fastapi.responses import StreamingResponse
from app.utils.r2 import r2
import os
from urllib.parse import quote

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
                    plan_pdf_key=item.plan_pdf_key,
                    plan_pdf_name=item.plan_pdf_name,
                    plan_uploaded_at=item.plan_uploaded_at,
                )
            )

    return JourneyDashboard(
        active_plans=active_plans,
    )


@router.get("/order-items/{order_item_id}/plan")
def view_training_plan(
    order_item_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    item = session.get(OrderItem, order_item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Training plan not found.",
        )

    order = session.get(Order, item.order_id)

    if not order or order.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this training plan.",
        )

    if not item.plan_pdf_key:
        raise HTTPException(
            status_code=404,
            detail="Training plan has not been uploaded yet.",
        )

    pdf = r2.get_object(
        Bucket=os.getenv("R2_BUCKET"),
        Key=item.plan_pdf_key,
    )

    return StreamingResponse(
        pdf["Body"],
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{item.plan_pdf_name}"'},
    )


@router.get("/order-items/{order_item_id}/download-plan")
def download_training_plan(
    order_item_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    item = session.get(OrderItem, order_item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Training plan not found.",
        )

    order = session.get(Order, item.order_id)

    if not order or order.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this training plan.",
        )

    if not item.plan_pdf_key:
        raise HTTPException(
            status_code=404,
            detail="Training plan has not been uploaded yet.",
        )

    pdf = r2.get_object(
        Bucket=os.getenv("R2_BUCKET"),
        Key=item.plan_pdf_key,
    )

    filename = item.plan_pdf_name or "training-plan.pdf"

    return StreamingResponse(
        pdf["Body"],
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{quote(filename)}",
            "X-Filename": filename,
        },
    )
