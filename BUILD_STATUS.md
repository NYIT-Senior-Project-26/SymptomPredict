# Build Status

_Last checked: 2026-10-05_

Snapshot of what works in the current build, what is blocked on configuration, and what is not built yet. Endpoints were tested locally with no API keys set.

## Summary

| Area | Status |
|---|---|
| Backend server | ✅ Runs; `pytest` passes (2/2) |
| Medication lookup (RxNav, openFDA) | ✅ Working, no keys needed |
| Symptom prediction (Claude) | ⚠️ Needs `ANTHROPIC_API_KEY` |
| Nearby providers (Google Places) | ⚠️ Needs `GOOGLE_PLACES_API_KEY` |
| Telehealth video tokens (Twilio) | ⚠️ Needs Twilio credentials |
| Appointment availability (Zocdoc) | ❌ Not built (partner-only API) |
| Medication prices (GoodRx) | ❌ Not built (partner-only API) |
| Agora video | ❌ Not built |
| ML model | ❌ Not trained |
| Database persistence | ❌ Not wired to any endpoint |
| Frontend | ❔ Untested (Node.js not installed) |

## Working

- **Server and health check:** the app starts and `GET /health` returns `{"status": "ok"}`.
- **Tests:** both tests in `backend/tests/test_health.py` pass.
- **`GET /api/v1/medications/search`** (RxNav): returns real drug results.
- **`GET /api/v1/medications/label`** (openFDA): returns FDA label data, and a 404 for unknown drugs.
- **Input validation on `POST /api/v1/predict`:** an empty symptom list is rejected with a 422.

## Blocked on API keys

The code for these is in place. Copy `.env.example` to `.env` at the repo root and fill in the keys.

| Endpoint | Current result | Needs |
|---|---|---|
| `POST /api/v1/predict` | 500 Internal Server Error | `ANTHROPIC_API_KEY` |
| `GET /api/v1/providers/nearby` | 500 Internal Server Error (Google returns 403) | `GOOGLE_PLACES_API_KEY` |
| `POST /api/v1/telehealth/token` | 503 "Twilio credentials not configured" | `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SID`, `TWILIO_API_KEY_SECRET` |

## Not built yet

- **Zocdoc (`GET /api/v1/providers/availability`)** and **GoodRx (`GET /api/v1/medications/prices`):** placeholders that always return 501. They can't be built until partner API access is granted.
- **Agora video:** `agora_token()` is a placeholder that raises `NotImplementedError`. Twilio is the working option.
- **ML model:** `backend/models/` holds no trained model (`symptom_model.joblib`). `/predict` still works without it; Claude does the analysis alone.
- **Database:** the SQLAlchemy model (`backend/app/db/models.py`) and Supabase schema (`backend/supabase/schema.sql`) exist, but no endpoint reads or writes them, so symptom checks aren't saved.

## Frontend

- **Not run:** Node.js isn't installed on the test machine, so `npm install`, the type check and `expo start` weren't run.
- **One screen:** `App.tsx` has only the symptom-check screen, which calls `/predict`.
- **Unused pieces:** `api.nearbyProviders` and `api.searchMedication` in `src/api/client.ts` aren't used by any screen, and `expo-location` is installed but never used.

## Known issues

- **Unclear errors when a key is missing:** `/predict` and `/providers/nearby` return a bare 500 instead of a clear message. `/predict` only catches `RuntimeError`, but a missing Anthropic key raises a different error type. `/providers/nearby` doesn't catch errors from Google at all.
- **Thin test coverage:** only two tests, and none cover the external services.

## Next steps

1. Create the root `.env` and add an Anthropic key so the main symptom-check flow works.
2. Install [Node.js LTS](https://nodejs.org) and run the frontend.
3. Return clear errors when a key is missing in `/predict` and `/providers/nearby`.
4. ~~Save symptom checks to the database.~~ Dropped: because of HIPAA, the team decided not to store user health information (see [frontend/PROGRESS.md](frontend/PROGRESS.md#privacy-no-login-nothing-saved)). Keep `/predict` free of logging and storage.
5. Add screens for nearby providers and medication search.
6. Train and add the ML model.
