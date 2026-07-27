from sqlmodel import Session, select
from app.database import engine
from app.models import Service, ServicePlan, FulfillmentType


def seed_services():
    with Session(engine) as session:
        existing_service = session.exec(
            select(Service).where(
                Service.slug == "personal"
            )
        ).first()

        if existing_service:
            print("Services have already been seeded.")
            return
        
        personal = Service(
            slug="personal",
            title_en="Personal Training",
            title_ar="التدريب الشخصي",
            fulfillment_type=FulfillmentType.SESSION,
        )

        group = Service(
            slug="group",
            title_en="Small Group Training",
            title_ar="التدريب الجماعي المصغّر",
            fulfillment_type=FulfillmentType.SESSION,
        )

        online = Service(
            slug="online",
            title_en="Online Coaching",
            title_ar="التدريب أونلاين",
            fulfillment_type=FulfillmentType.SESSION,
        )

        plans = Service(
            slug="plans",
            title_en="Workout Plans",
            title_ar="الجداول الرياضية",
            fulfillment_type=FulfillmentType.DIGITAL,
       )

        session.add(personal)
        session.add(group)
        session.add(online)
        session.add(plans)
        session.commit()

        session.refresh(personal)
        session.refresh(group)
        session.refresh(online)
        session.refresh(plans)

        plans = [
            ServicePlan(
                service_id=personal.id,
                code="personal-8",
                title_en="8 Sessions",
                title_ar="8 جلسات",
                sessions=8,
                price_halalas=80000,
                sort_order=1,
            ),
            ServicePlan(
                service_id=personal.id,
                code="personal-12",
                title_en="12 Sessions",
                title_ar="12 جلسة",
                sessions=12,
                price_halalas=120000,
                sort_order=2,
            ),
            ServicePlan(
                service_id=group.id,
                code="group-8",
                title_en="8 Sessions",
                title_ar="8 جلسات",
                sessions=8,
                price_halalas=60000,
                sort_order=1,
            ),
            ServicePlan(
                service_id=group.id,
                code="group-12",
                title_en="12 Sessions",
                title_ar="12 جلسة",
                sessions=12,
                price_halalas=90000,
                sort_order=2,
            ),
            ServicePlan(
                service_id=online.id,
                code="online-ready",
                title_en="Ready Plan",
                title_ar="خطة جاهزة",
                sessions=None,
                price_halalas=30000,
                sort_order=1,
            ),
            ServicePlan(
                service_id=online.id,
                code="online-personalized",
                title_en="Personalized Plan",
                title_ar="خطة مخصصة",
                sessions=None,
                price_halalas=50000,
                sort_order=2,
            ),
        ]
        session.add_all(plans)
        session.commit()

        print("Services and plans created successfully.")


if __name__ == "__main__":
    seed_services()