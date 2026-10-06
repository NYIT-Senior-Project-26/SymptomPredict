"""Video-visit tokens. Twilio Video is implemented; Agora is a drop-in alternative."""

from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

from app.core.config import get_settings


def twilio_video_token(identity: str, room: str) -> str:
    s = get_settings()
    if not (s.twilio_account_sid and s.twilio_api_key_sid and s.twilio_api_key_secret):
        raise RuntimeError("Twilio credentials not configured")
    token = AccessToken(s.twilio_account_sid, s.twilio_api_key_sid, s.twilio_api_key_secret, identity=identity)
    token.add_grant(VideoGrant(room=room))
    return token.to_jwt()


def agora_token(channel: str, uid: int) -> str:
    # pip install agora-token-builder, then use RtcTokenBuilder.buildTokenWithUid(...)
    raise NotImplementedError("Agora not wired up yet")
