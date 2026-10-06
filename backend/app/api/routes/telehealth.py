from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.external import telehealth

router = APIRouter(prefix="/telehealth", tags=["telehealth"])


class TokenRequest(BaseModel):
    identity: str
    room: str


@router.post("/token")
async def video_token(req: TokenRequest):
    try:
        return {"token": telehealth.twilio_video_token(req.identity, req.room)}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
