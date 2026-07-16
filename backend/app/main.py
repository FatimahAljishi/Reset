from fastapi import FastAPI, HTTPException #type:ignore
from fastapi.middleware.cors import CORSMiddleware #type:ignore 
from app.database import create_db
from app import models
from app.routers.services import router as services_router
from app.routers.contact import router as contact_router
from app.routers.payments import router as payments_router
from app.routers.orders import router as orders_router
from app.seed_services import seed_services
from app.routers.trainer import router as trainer_router

app = FastAPI(title="Reset API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://reset-by-zainab.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db()
    seed_services()

app.include_router(services_router)
app.include_router(contact_router)
app.include_router(payments_router)
app.include_router(orders_router)
app.include_router(trainer_router)