from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Service
from app.schemas import ServiceResponse


router = APIRouter(
    prefix="/services",
    tags=["Services"],
)


@router.get("", response_model=list[ServiceResponse])
def get_services(session: Session = Depends(get_session)):
    statement = (
        select(Service)
        .order_by(Service.id)
    )

    services = session.exec(statement).all()

    return services


@router.get("/{slug}", response_model=ServiceResponse)
def get_service(
    slug: str,
    session: Session = Depends(get_session),
):
    statement = select(Service).where(
        Service.slug == slug,
    )

    service = session.exec(statement).first()

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found.",
        )

    return service