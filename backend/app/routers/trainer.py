from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_trainer_id
from app.schemas import (
    TrainerOrder,
    TrainerOrderItem,
    TrainerDashboard,
    ActiveClient,
    MessageResponse,
    TrainingSessionResponse,
    ActionItem,
)
from app.database import get_session
from sqlmodel import Session, select
from app.models import (
    Order,
    FulfillmentStatus,
    OrderStatus,
    OrderItem,
    TrainingPackage,
    TrainingSession,
)
from datetime import datetime, timedelta, timezone

router = APIRouter(
    prefix="/trainer",
    tags=["Trainer"],
)


def expire_old_pending_orders(session: Session) -> None:
    expiration_time = datetime.now(timezone.utc) - timedelta(hours=1)

    statement = select(Order).where(
        Order.status == OrderStatus.PENDING,
        Order.created_at < expiration_time,
    )

    expired_orders = session.exec(statement).all()

    for order in expired_orders:
        order.status = OrderStatus.EXPIRED
        session.add(order)

    session.commit()

    print(f"Expired {len(expired_orders)} pending order(s).")


def build_trainer_order(order: Order, session: Session) -> TrainerOrder:
    items: list[TrainerOrderItem] = []

    for item in order.items:
        package = session.exec(
            select(TrainingPackage).where(TrainingPackage.order_item_id == item.id)
        ).first()

        items.append(
            TrainerOrderItem(
                id=item.id,
                package_id=package.id if package else None,
                service=item.service_title_en,
                plan=item.plan_title_en,
                quantity=item.quantity,
                fulfillment_status=item.fulfillment_status,
            )
        )

    return TrainerOrder(
        id=order.id,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        phone=order.phone,
        status=order.status,
        total_halalas=order.total_halalas,
        created_at=order.created_at,
        items=items,
    )


@router.get(
    "/dashboard",
    response_model=TrainerDashboard,
)
def get_trainer_dashboard(
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    expire_old_pending_orders(session)
    statement = select(Order).order_by(Order.created_at.desc())

    orders = session.exec(statement).all()

    recent_orders = [build_trainer_order(order, session) for order in orders]

    needs_action: list[ActionItem] = []

    for order in orders:
        if order.status != OrderStatus.PAID:
            continue

        for item in order.items:
            if item.fulfillment_status not in (
                FulfillmentStatus.NEEDS_CONTACT,
                FulfillmentStatus.NEEDS_DELIVERY,
            ):
                continue

            needs_action.append(
                ActionItem(
                    order_item_id=item.id,
                    order_id=order.id,
                    customer_name=order.customer_name,
                    phone=order.phone,
                    created_at=order.created_at,
                    service=item.service_title_en,
                    plan=item.plan_title_en,
                    fulfillment_status=item.fulfillment_status,
                )
            )

    active_clients: list[ActiveClient] = []
    packages = session.exec(
        select(TrainingPackage).where(TrainingPackage.completed_at.is_(None))
    ).all()

    for package in packages:
        order_item = session.get(
            OrderItem,
            package.order_item_id,
        )

        if not order_item:
            continue

        if order_item.fulfillment_status not in (
            FulfillmentStatus.CONTACTED,
            FulfillmentStatus.IN_PROGRESS,
        ):
            continue

        order = session.get(
            Order,
            order_item.order_id,
        )

        if not order:
            continue

        if order_item.fulfillment_status == FulfillmentStatus.CONTACTED:
            progress = "Not Started"

        elif order_item.fulfillment_status == FulfillmentStatus.IN_PROGRESS:
            progress = "In Progress"

        else:
            progress = "Completed"

        sessions_completed = len(package.sessions)
        sessions_remaining = package.total_sessions - sessions_completed
        progress_percentage = (sessions_completed / package.total_sessions) * 100

        active_clients.append(
            ActiveClient(
                package_id=package.id,
                order_id=order.id,
                customer_name=order.customer_name,
                service=order_item.service_title_en,
                plan=order_item.plan_title_en,
                sessions_completed=sessions_completed,
                total_sessions=package.total_sessions,
                sessions_remaining=sessions_remaining,
                progress=progress,
                progress_percentage=progress_percentage,
            )
        )

        active_clients.sort(
            key=lambda client: client.order_id,
        )

    return TrainerDashboard(
        needs_action=needs_action,
        active_clients=active_clients,
        recent_orders=recent_orders,
    )


@router.patch(
    "/order-items/{order_item_id}/mark-contacted",
    response_model=MessageResponse,
)
def mark_order_item_contacted(
    order_item_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    item = session.get(OrderItem, order_item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found.",
        )
    if item.fulfillment_status != FulfillmentStatus.NEEDS_CONTACT:
        raise HTTPException(
            status_code=400,
            detail="This item cannot be marked as contacted.",
        )

    item.fulfillment_status = FulfillmentStatus.CONTACTED

    session.add(item)
    session.commit()
    session.refresh(item)

    return MessageResponse(message="Client marked as contacted.")


@router.patch(
    "/order-items/{order_item_id}/undo-contact",
    response_model=MessageResponse,
)
def undo_order_item_contact(
    order_item_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    item = session.get(OrderItem, order_item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found.",
        )

    if item.fulfillment_status != FulfillmentStatus.CONTACTED:
        raise HTTPException(
            status_code=400,
            detail="This item cannot be reverted.",
        )

    item.fulfillment_status = FulfillmentStatus.NEEDS_CONTACT

    session.add(item)
    session.commit()
    session.refresh(item)

    return MessageResponse(
        message="Contact status reverted.",
    )


@router.patch(
    "/order-items/{order_item_id}/undo-delivery",
    response_model=MessageResponse,
)
def undo_order_item_delivery(
    order_item_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    item = session.get(OrderItem, order_item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found.",
        )

    if item.fulfillment_status != FulfillmentStatus.DELIVERED:
        raise HTTPException(
            status_code=400,
            detail="This item cannot be reverted.",
        )

    item.fulfillment_status = FulfillmentStatus.NEEDS_DELIVERY

    session.add(item)
    session.commit()
    session.refresh(item)

    return MessageResponse(
        message="Delivery status reverted.",
    )


@router.patch(
    "/order-items/{order_item_id}/mark-delivered",
    response_model=MessageResponse,
)
def mark_order_item_delivered(
    order_item_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    item = session.get(OrderItem, order_item_id)

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found.",
        )

    if item.fulfillment_status != FulfillmentStatus.NEEDS_DELIVERY:
        raise HTTPException(
            status_code=400,
            detail="This item cannot be marked as delivered.",
        )

    item.fulfillment_status = FulfillmentStatus.DELIVERED

    session.add(item)
    session.commit()
    session.refresh(item)

    return MessageResponse(message="Workout schedule marked as delivered.")


@router.post(
    "/packages/{package_id}/sessions",
    response_model=TrainingSessionResponse,
)
def complete_training_session(
    package_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    package = session.get(TrainingPackage, package_id)

    if not package:
        raise HTTPException(
            status_code=404,
            detail="Training package not found.",
        )
    completed_sessions = len(package.sessions)
    if completed_sessions >= package.total_sessions:
        raise HTTPException(
            status_code=400,
            detail="All sessions have already been completed.",
        )
    next_session = completed_sessions + 1
    training_session = TrainingSession(
        training_package_id=package.id,
        session_number=next_session,
    )
    session.add(training_session)
    if package.started_at is None:
        package.started_at = training_session.completed_at
    if next_session == package.total_sessions:
        package.completed_at = training_session.completed_at

    order_item = session.get(OrderItem, package.order_item_id)

    if not order_item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found.",
        )

    if order_item.fulfillment_status == FulfillmentStatus.NEEDS_CONTACT:
        raise HTTPException(
            status_code=400,
            detail="Contact the client before recording a session.",
        )

    if next_session == package.total_sessions:
        order_item.fulfillment_status = FulfillmentStatus.COMPLETED
    else:
        order_item.fulfillment_status = FulfillmentStatus.IN_PROGRESS

    session.add(package)
    session.add(order_item)

    session.commit()

    session.refresh(package)
    session.refresh(order_item)

    return TrainingSessionResponse(
        session_number=next_session,
        sessions_completed=next_session,
        sessions_remaining=package.total_sessions - next_session,
        completed=next_session == package.total_sessions,
    )


@router.delete(
    "/packages/{package_id}/sessions/latest",
    response_model=TrainingSessionResponse,
)
def remove_last_training_session(
    package_id: int,
    session: Session = Depends(get_session),
    _: str = Depends(get_current_trainer_id),
):
    package = session.get(TrainingPackage, package_id)

    if not package:
        raise HTTPException(
            status_code=404,
            detail="Training package not found.",
        )

    last_session = session.exec(
        select(TrainingSession)
        .where(TrainingSession.training_package_id == package.id)
        .order_by(TrainingSession.session_number.desc())
    ).first()

    if not last_session:
        raise HTTPException(
            status_code=400,
            detail="No recorded sessions found.",
        )

    session.delete(last_session)

    sessions_completed = last_session.session_number - 1

    if sessions_completed == 0:
        package.started_at = None

    package.completed_at = None

    order_item = session.get(
        OrderItem,
        package.order_item_id,
    )

    if not order_item:
        raise HTTPException(
            status_code=404,
            detail="Order item not found.",
        )

    if sessions_completed == 0:
        order_item.fulfillment_status = FulfillmentStatus.CONTACTED
    else:
        order_item.fulfillment_status = FulfillmentStatus.IN_PROGRESS

    session.add(package)
    session.add(order_item)

    session.commit()
    session.refresh(package)

    return TrainingSessionResponse(
        session_number=sessions_completed,
        sessions_completed=sessions_completed,
        sessions_remaining=package.total_sessions - sessions_completed,
        completed=False,
    )
