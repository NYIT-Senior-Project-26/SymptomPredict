# SymptomPredict

| Layer | Tech | Location |
|---|---|---|
| Frontend | React Native (Expo, TypeScript) | `frontend/` |
| API Gateway | FastAPI (Python) | `backend/app/main.py`, `backend/app/api/routes/` |
| Prediction Engine | Python ML (scikit-learn) + Claude API | `backend/app/prediction/` |
| Database | PostgreSQL (Supabase) | `backend/app/db/`, `backend/supabase/schema.sql` |
| External APIs | Google Places, Zocdoc, GoodRx, RxNav, openFDA, Twilio/Agora | `backend/app/services/external/` |

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows  (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
cp .env.example .env            # then fill in keys
uvicorn app.main:app --reload
```

Interactive API docs: http://localhost:8000/docs. Run the tests with `pytest`.

### API endpoints (`/api/v1`)

| Method | Path | Uses |
|---|---|---|
| POST | `/predict` | ML model + Claude |
| GET | `/providers/nearby` | Google Places |
| GET | `/providers/availability` | Zocdoc (needs partner access) |
| GET | `/medications/search` | RxNav |
| GET | `/medications/label` | openFDA |
| GET | `/medications/prices` | GoodRx (needs partner access) |
| POST | `/telehealth/token` | Twilio Video |

### Supabase

1. Create a project at https://supabase.com.
2. Run `backend/supabase/schema.sql` in the SQL Editor.
3. Copy the database connection string into `DATABASE_URL` (change `postgresql://` to `postgresql+asyncpg://`), plus `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Frontend

Requires [Node.js LTS](https://nodejs.org).

```bash
cd frontend
npm install
npx expo install --fix          # aligns package versions with the Expo SDK
cp .env.example .env
npx expo start                  # scan the QR code with Expo Go
```

On a physical phone, set `EXPO_PUBLIC_API_URL` to your computer's LAN IP (e.g. `http://192.168.1.20:8000/api/v1`) and start the backend with `uvicorn app.main:app --reload --host 0.0.0.0`.

## API keys checklist

| Service | Where to get it | Notes |
|---|---|---|
| Anthropic (Claude) | https://console.anthropic.com | Required for `/predict` |
| Google Places | Google Cloud Console → enable "Places API (New)" | |
| Zocdoc | Zocdoc partner program | Partner-only API |
| GoodRx | GoodRx developer/partner program | Partner-only API |
| RxNav | — | Free, no key |
| openFDA | https://open.fda.gov/apis/authentication/ | Optional key (raises the rate limit) |
| Twilio Video | https://console.twilio.com → API Keys | Account SID + API key SID/secret |
| Agora (alternative) | https://console.agora.io | App ID + certificate |

All secrets live in `backend/.env`. Never put them in `frontend/.env`: anything prefixed `EXPO_PUBLIC_` is bundled into the app.
