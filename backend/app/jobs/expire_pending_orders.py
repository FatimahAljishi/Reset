from datetime import datetime, timedelta, timezone

from sqlmodel import Session, select

from app.database import engine
from app.models import Order


def expire_pending_orders() -> None:
    expiration_time = datetime.now(timezone.utc) - timedelta(hours=1)

    with Session(engine) as session:
        statement = select(Order).where(
            Order.status == "pending",
            Order.created_at < expiration_time,
        )

        expired_orders = session.exec(statement).all()

        for order in expired_orders:
            order.status = "expired"
            session.add(order)

        session.commit()

        print(
            f"Expired {len(expired_orders)} pending order(s)."
        )


if __name__ == "__main__":
    expire_pending_orders()