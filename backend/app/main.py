from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import medications, predict, providers, telehealth, triage
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title="SymptomPredict API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in (predict.router, triage.router, providers.router, medications.router, telehealth.router):
    app.include_router(r, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "env": settings.app_env}
