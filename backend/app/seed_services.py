from sqlmodel import Session, select
from app.database import engine
from app.models import Service, ServicePlan, FulfillmentType


def seed_services():
    with Session(engine) as session:
        existing_service = session.exec(
            select(Service).where(Service.slug == "personal")
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

        ready_programs = Service(
            slug="ready-programs",
            title_en="Ready-Made Programs",
            title_ar="البرامج الرياضية الجاهزة",
            fulfillment_type=FulfillmentType.DIGITAL,
        )

        personalized_programs = Service(
            slug="personalized-programs",
            title_en="Personalized Program",
            title_ar="برنامج رياضي مخصص",
            fulfillment_type=FulfillmentType.DIGITAL,
        )

        session.add(personal)
        session.add(group)
        session.add(online)
        session.add(ready_programs)
        session.add(personalized_programs)
        session.commit()

        session.refresh(personal)
        session.refresh(group)
        session.refresh(online)
        session.refresh(ready_programs)
        session.refresh(personalized_programs)

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
                code="online-12",
                title_en="12 Sessions",
                title_ar="12 جلسة",
                sessions=12,
                price_halalas=120000,
                sort_order=1,
            ),
            ServicePlan(
                service_id=personalized_programs.id,
                code="personalized",
                title_en="",
                title_ar="",
                sessions=None,
                price_halalas=35000,
                sort_order=1,
            ),
            ServicePlan(
                service_id=ready_programs.id,
                code="ready",
                title_en="",
                title_ar="",
                sessions=None,
                price_halalas=19900,
                sort_order=1,
            ),
        ]
        session.add_all(plans)
        session.commit()

        print("Services and plans created successfully.")


if __name__ == "__main__":
    seed_services()
