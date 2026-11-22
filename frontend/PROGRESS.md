# Frontend Progress

_Last updated: 2026-11-22_

Status of the Expo app: what is built, what is still a placeholder, and what comes next. The screens are built from the DiagnosisCloud designs on page 1 of the [Figma file](https://www.figma.com/design/6DFreMInyAv75dL3sLb8G0/Untitled?node-id=0-1).

## Summary

| Area | Status |
|---|---|
| Expo SDK | ✅ SDK 58, packages updated to the latest SDK 58 patch versions |
| Routing (Expo Router) | ✅ All 30 visible Figma screens have a route |
| Design tokens (colors, fonts) | ✅ Taken from Figma variables |
| Shared components | ✅ All components from the Figma components frame |
| Onboarding & profile setup (1.1–1.7) | ✅ Built; no login, profile kept in memory only (see [Privacy](#privacy-no-login-nothing-saved)) |
| Home & symptom intake (2.1–2.8) | ✅ Built from the Figma frames; full intake sent to `/predict` |
| Symptom prediction (ML model + Claude) | ✅ Connected; a real `/predict` request returns a result (see [Symptom prediction](#symptom-prediction)) |
| Results & care (3.x) | ⚠️ Result, Emergency and Condition detail built; Providers and Pharmacy are scaffolds (see [Ported screens](#ported-screens)) |
| Chat & follow-up (4.x) | ⚠️ Export and Feedback built; Medication chat and Profile are scaffolds; History, Tracker and Diagnosis chat are placeholders |
| Tested on a device | ❔ Type check passes; phone setup worked out (see [Running on a phone](#running-on-a-phone)), full walkthrough in Expo Go not yet confirmed |

## Running the app

```
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go. The project is on **SDK 58**, so Expo Go must be the SDK 58 version. If you see errors from an old cache, run `npx expo start -c`.

If Expo says package updates are available, run `npx expo install --fix`. Don't run `npm audit fix --force`: it can install versions that don't work with SDK 58.

### Backend for the symptom check

The symptom check needs the backend running. From the repo root:

```
pip install -r requirements.txt -r backend/requirements.txt
cp .env.example .env                      # then set ANTHROPIC_API_KEY
cd backend
python -m ml_layer.train_model            # once per machine; the model file is gitignored
uvicorn app.main:app --host 0.0.0.0
```

- **No trained model:** `/predict` still works, but Claude analyzes without the model's ranking.
- **`--reload` on Windows:** auto-reload can get stuck halfway ("Reloading..." with no "Started server process" after it) and keep serving the old code. If that happens, stop the server and start it again.
- **After editing `.env`:** restart the backend and Expo; both read it only at startup. The project has one `.env`, at the repo root (see the root README).

### Running on a phone

1. In the root `.env`, set `EXPO_PUBLIC_API_URL=http://<your computer's IP>:8000/api/v1`, not `localhost`. On Windows, `ipconfig` shows the IP under "Wi-Fi".
2. Put the phone and the computer on the same network, then restart Expo with `npx expo start -c` so it picks up the `.env` change.
3. Check that the phone can reach the backend: open `http://<IP>:8000/health` in the phone's browser. It should show `{"status":"ok",...}`.

**Guest and campus Wi-Fi block this.** They usually stop devices from connecting to each other. Expo Go on Android then shows `java.io.IOException: Failed to download remote update`. Fixes:
- **Phone hotspot (recommended):** connect the computer to the phone's hotspot. The computer's IP changes, so update the root `.env` and restart Expo.
- **`npx expo start --tunnel`:** the app loads, but the symptom check still can't reach the backend.

After switching networks, fully close Expo Go and scan the new QR code; the "Recently opened" entry points to the old address.

**"Unable to resolve react-native-web" when bundling:** that's the web version (pressing `w`, or opening `localhost:8081` in a browser). Web support isn't installed, and it doesn't affect the phone.

## Project layout

```
frontend/
├── app/                  Routes (one file per screen, Expo Router)
│   ├── _layout.tsx       Root stack: loads fonts, sets the header, lists every route
│   ├── (onboarding)/     Welcome, privacy & consent
│   ├── setup/            Profile setup steps
│   ├── (tabs)/           Home, History, Chat, Profile (bottom tab bar)
│   ├── intake/           Symptom intake steps and the analyzing screen
│   ├── results/          Triage result, providers, pharmacy, emergency, condition detail
│   ├── chat/             Diagnosis and medication chatbots
│   └── components.tsx    Component gallery (development only)
├── assets/               Logo and icons exported from Figma
└── src/
    ├── api/client.ts     Backend API calls
    ├── components/       Shared building blocks used across features: the Figma components (Button,
    │                     Chip, TriageBadge, …) plus ScreenLayout, Checkbox, ScreenPlaceholder
    ├── intake/           Symptom intake (2.x)
    │   ├── content.ts        Options and questions (+ bodyAreaQuestions.ts)
    │   ├── request.ts        Builds the /predict request
    │   ├── state.tsx         Holds intake answers and the prediction result
    │   └── components.tsx    UI pieces shared by the intake screens
    ├── profile/          Profile setup (1.3–1.7)
    │   ├── content.ts        Options
    │   ├── state.tsx         Holds the profile (memory only)
    │   └── components.tsx    UI pieces shared by the setup screens
    ├── results/          Results & care (3.x) and follow-up (4.x)
    │   ├── urgency.ts        What each urgency level shows
    │   ├── pdf.ts            The export PDF
    │   ├── components.tsx    UI pieces shared by the results screens
    │   └── PlacesList.tsx    Nearby places (starting point for Providers and Pharmacy)
    ├── screens/          4 unported React Navigation screens, not used (see its README)
    └── theme/index.ts    Colors, fonts and the shared card style
```

**Where code goes:** a feature's content, state and UI pieces live together in its folder (`src/intake/`, `src/profile/`, `src/results/`). Only code used by more than one feature goes in `src/components/`. Screens in `app/` stay thin and import from these.

Use the `@/` alias for anything in `src/`, for example `import { colors } from '@/theme'`. Inside a feature folder, import its own files relatively (`./state`). Use colors from `theme` rather than writing hex values, and spread `card` for the bordered white card (`{ ...card, gap: 10 }`).

## Design tokens

[src/theme/index.ts](src/theme/index.ts) holds the values from Figma:

- **`colors`:** the named colors used by components (`brandPrimary`, `textSecondary`, `triageRed`, …). Use these in screens.
- **`palette`:** the full color ramps from the ColorPalette frame (grey, secondary, tertiary, quaternary).
- **`fonts`:** Inter in Regular, Medium, SemiBold and Bold. Set `fontFamily` from here rather than using `fontWeight`.

## Components

All in [src/components/](src/components/). To see them together, open **Profile → Component gallery** in the app.

| Figma | Component | Notes |
|---|---|---|
| Header/Back | `HeaderBack` | Header for every stack screen (set in `app/_layout.tsx`) |
| Header/Brand | `HeaderBrand` | Logo and notifications bell |
| Nav/Bottom | `NavBottom` | Bottom tab bar |
| Button | `Button` | `primary` and `hero` styles, optional icon and loading state |
| Stepper | `Stepper` | Intake progress, steps 1–3 |
| Chip | `Chip` | Selectable tag |
| Triage Badge | `TriageBadge` | `self-care`, `appointment`, `emergency` |
| Card/Diagnosis | `DiagnosisCard` | Ranked condition with match bar |
| (logo) | `Logo` | Sizes: `header`, `home`, `welcome` |
| (icons) | `Icon` | Figma SVG icons; `color` recolors them |
| — | `ScreenPlaceholder` | Temporary stand-in for screens not built yet |

## Screen status

**Placeholder** means the route exists and the navigation buttons work, but the Figma design hasn't been built yet. **Scaffold** is a placeholder that also lists the Figma frame's sections in order, with where each one's data comes from, and links to the frame in Figma. It's ready for a teammate to build. To add one, pass `figmaNode` and `sections` to `ScreenPlaceholder`.

| # | Figma frame | Route | Status |
|---|---|---|---|
| 1.1 | Splash / Welcome | `/welcome` | ✅ Built |
| 1.2 | Privacy & Data Consent | `/consent` | ✅ Built (privacy points reworded, see below) |
| 1.3 | Profile · Basic info | `/setup/basic` | ✅ Built |
| 1.4 | Profile · Allergies | `/setup/allergies` | ✅ Built (no reaction field) |
| 1.5 | Profile · Medications | `/setup/medications` | ✅ Built (no dose field; Scan shows "not available yet") |
| 1.6 | Profile · Ongoing conditions | `/setup/conditions` | ✅ Built (tracker note left out) |
| 1.7 | Profile · Insurance | `/setup/insurance` | ✅ Built (no member ID; Scan shows "not available yet") |
| 2.1 | Home Dashboard | `/home` | ✅ Built |
| 2.2 | Intake · Chief complaint | `/intake` | ✅ Built (Speak button shows "not available yet") |
| 2.3 | Intake · Body map | `/intake/body-map` | ✅ Built |
| 2.4 | Intake · Follow-up question | `/intake/follow-up?q=<n>` | ✅ Built (local question set, 8 per body area) |
| 2.5 | Intake · Severity & duration | `/intake/severity` | ✅ Built |
| 2.6 | Intake · High-risk check | `/intake/high-risk` | ✅ Built |
| 2.7 | Intake · Confirmation summary | `/intake/summary` | ✅ Built |
| 2.8 | Loading / Analysis | `/intake/analyzing` | ✅ Built; calls `/predict` |
| 3.1a–c | Triage Result (3 versions) | `/results` | ✅ Built from 3.1a/3.1b: next step, "See a doctor if you notice" (self-care), expandable condition cards with matching symptoms and "Why this match". Likelihood levels instead of match % |
| 3.2 | Emergency Escalation | `/results/emergency` | ✅ Ported; Call 911, poison control |
| 3.3 | Provider Recommendations | `/results/providers` | Scaffold (needs Zocdoc access for booking) |
| 3.5 | Pharmacy & OTC | `/results/pharmacy` | Scaffold (needs a medication-interaction source; GoodRx for prices) |
| 3.6a–b | Condition Detail | `/results/condition/[name]` | ✅ Built: two tabs filled from MedlinePlus (see [Condition details](#condition-details)). No OTC section |
| 4.1 | Medication Chatbot | `/chat/medication` | Scaffold (needs a backend chat endpoint) |
| 4.2 | Diagnosis Chatbot | `/chat/diagnosis` | Placeholder (no teammate version) |
| 4.3 | Session History | `/history` (tab) | Placeholder (needs saved data; see Open questions) |
| 4.5 | Export & Share Sheet | `/export` | ✅ Built; PDF of the triage result, share sheet and print |
| 4.6 | Post-Diagnosis Feedback | `/feedback` | ✅ Ported; checklist, when to seek care, "Was this helpful?" |
| 4.7 | Chronic Condition Tracker | `/tracker` | Placeholder (needs saved data) |
| 4.8 | Profile & Settings | `/profile` (tab) | Scaffold |

**Not included:**
- **1.8 Language** and **3.4 Virtual Visit:** hidden in Figma.
- **4.4 Doctor-Facing PDF:** a generated document, not an app screen. ✅ Built in [src/results/pdf.ts](src/results/pdf.ts) and shared from 4.5. It has no patient name or session ID (neither is collected), no OTC section, and likelihood levels instead of match %.

## Condition details

`POST /api/v1/conditions/detail` fills 3.6. The backend looks the condition up on **MedlinePlus** (U.S. National Library of Medicine, free, no key; [backend/app/services/external/medlineplus.py](../backend/app/services/external/medlineplus.py)), then Claude sorts only that text into the Figma sections and marks the symptoms the person reported ("You") and any treatment they're allergic to. Nothing is added beyond the source, and sections it doesn't cover are hidden. The footer links to the MedlinePlus page. MedlinePlus sometimes covers a condition under a broader topic (strep throat → "Streptococcal Infections"); the hero then says so. If there's no MedlinePlus page, the screen shows why the condition came up and a "Search MedlinePlus" button.

The OTC section from the Treatment options frame was left out on purpose (no medicine suggestions). Details are kept in memory for the session only.

## Ported screens

The team built screens in `src/screens/` for React Navigation, which the app doesn't use (it runs on Expo Router, with routes in `app/`). They were brought in like this:

- **Duplicates removed:** the onboarding, profile setup, home and intake versions (15 screens), `App.tsx`, and the copies in `src/` were deleted; the existing `app/` screens were kept because they're connected to state and `/predict`.
- **Ported into `app/`:** results (merging DiagnosisResults and Triage), emergency, condition detail and post-diagnosis. Each uses Expo Router, the theme and shared components, and the real check result instead of sample data. Fixed common-cold text (condition detail) and follow-up reminders (post-diagnosis) were left out.
- **Export (4.5) rebuilt from Figma:** a one-page PDF of the triage result ([src/results/pdf.ts](src/results/pdf.ts)) with a preview, shared through the phone's share sheet or printed. Uses `expo-print`, `expo-sharing` and `expo-file-system`.
- **Scaffolds for a teammate to build:** Providers (3.3), Pharmacy (3.5), Medication chat (4.1) and Profile (4.8). The team's versions relied on sample content that could mislead in a health app: made-up doctors, a fixed list of drugs and doses, hard-coded answers about drug interactions, a sample user and storage claims. Each scaffold lists its Figma sections and what each needs. Starting point for Providers and Pharmacy: [src/results/PlacesList.tsx](src/results/PlacesList.tsx) lists real nearby places from `/providers/nearby` with the phone's location.
- **Not ported yet:** Session history, Session summary, Chronic tracker and Doctor-facing PDF need saved data. They stay in `src/screens/` (excluded from the type check); see [its README](src/screens/README.md).

## Privacy: no login, nothing saved

Because of HIPAA, the team decided not to store user health information in a database. The app goes further: there are no accounts, and nothing is saved on the phone either.

- **What's kept:** the profile ([src/profile/state.tsx](src/profile/state.tsx)) and the intake answers and result ([src/intake/state.tsx](src/intake/state.tsx)) live in memory only. Intake answers are cleared when a new check starts; everything is gone when the app closes.
- **What leaves the phone:** during a check, the answers go to the backend, which ranks them with the ML model on the server and sends them to Claude to produce the result. From the profile, age, sex, allergies, medications, conditions, blood pressure and smoking status are included; **insurance is never sent**. The backend doesn't log or save any of it. Keep it that way: the unused `SymptomCheck` table and Supabase schema shouldn't be wired up.
- **Export:** the PDF is written to the app's cache only while sharing, then deleted. It includes the result, possible conditions, age, sex, symptoms and intake answers, but not insurance. Once shared, it's kept by whatever app the person sends it to.
- **Location (when Providers and Pharmacy are built):** `PlacesList` asks for the phone's location, then sends it with the search (e.g. the suggested specialty) to the backend, which passes it to Google Places.
- **Onboarding every launch:** nothing is remembered, so Welcome, Privacy & consent and profile setup show on every launch.
- **Consent screen wording:** the Figma frame says "Encrypted end-to-end … at rest", "HIPAA compliant" and "Export or delete your history anytime in Settings". None of these is true for this app (nothing is stored, and HIPAA compliance would require a signed agreement, a BAA, with the AI provider). The three points were rewritten to describe what the app actually does. The text is in `POINTS` in [app/(onboarding)/consent.tsx](app/(onboarding)/consent.tsx); the Figma frame should be updated to match.
- **Other wording changed:** the analyzing screen (2.8) mentions "your health profile" and "Checking allergies & medications" only when the profile has allergies, medications or conditions; otherwise the step reads "Checking for warning signs". The 1.6 note about unlocking the Chronic Condition Tracker was left out, since the tracker would need saved data.

## Open questions

- **Match percentage (decided):** the team chose likelihood levels (High / Medium / Low) instead of a match % on the result cards, condition detail and PDF, since Claude's conditions often aren't in the ML model and can't be scored. `DiagnosisCard` shows the level where Figma has the bar.
- **Symptom mappings need review:** which chips and follow-up answers count as which dataset symptom (e.g. "Fever" → `high_fever`, "Bloating" → `distention_of_abdomen`) is in [backend/app/prediction/symptom_map.py](../backend/app/prediction/symptom_map.py). Someone with clinical knowledge should check it.
- **Keep the mappings in sync:** `symptom_map.py` uses the question ids and option text from [src/intake/content.ts](src/intake/content.ts) and [src/intake/bodyAreaQuestions.ts](src/intake/bodyAreaQuestions.ts). If an option is renamed there, update the backend too, or that answer silently stops reaching the model.
- **Red flags are only in Claude's prompt:** Claude is told to raise urgency for red flags. A stronger version would have the backend set a minimum urgency for certain answers (for example, blood in vomit → at least urgent care). This needs a clinical decision on which answers count.
- **Chat tab:** it currently lets you choose between the diagnosis and medication chatbots. Should one of them be the tab itself?
- **Tab headers:** History, Chat and Profile use a plain title header for now. They will be matched to their own frames when those screens are built.
- **Follow-up questions need review:** the 64 body-area questions in [src/intake/bodyAreaQuestions.ts](src/intake/bodyAreaQuestions.ts) and the symptom questions in [src/intake/content.ts](src/intake/content.ts) were written as a starting point. Someone with clinical knowledge should review them, especially the warning-sign questions, before real use.
- **Voice input:** the Speak button on 2.2 needs speech recognition, which doesn't work in Expo Go (it needs a development build).
- **Screens that assume saved data:** Session History (4.3) and the Chronic Condition Tracker (4.7) were designed around stored data. Decide whether to drop them, or what they show when nothing is saved. Profile & Settings (4.8) can show and edit the in-memory profile ("Edit health profile" already reopens setup).
- **Profile setup every launch:** answering five profile screens each time the app opens is a lot. Consider letting people skip setup, or making it optional from the Profile tab.
- **Terms and Privacy Policy:** the welcome and consent screens refer to Terms & Conditions, a Terms of Service and a Privacy Policy, but none of these documents exist yet.

## Intake flow

Home → **2.2** chief complaint (text and/or symptom chips; "Pick a body area" opens **2.3**) → **2.4** one screen per follow-up question → **2.5** severity, duration, trend → **2.6** high-risk groups → **2.7** review → **2.8** analyzing → results.

**Follow-up questions** are split between two places:
1. **Bottom of the body map (2.3):** once an area is tapped, "Do you have a fever?" and that area's 8 questions from [src/intake/bodyAreaQuestions.ts](src/intake/bodyAreaQuestions.ts) (where exactly, what it feels like, how it started, related symptoms and warning signs) appear below the area's symptom chips. Continue stays disabled until they're all answered. This inline layout isn't in the Figma file.
2. **Follow-up screens (2.4), one question each:** questions for the selected symptom chips, skipping any the body-area set already covers (`covers`). If the body map was skipped, "Do you have a fever?" is asked here instead. If there's nothing left to ask, the flow goes straight to severity (2.5).

A question can:
- **have its own options:** without `options`, it uses Yes / No / I don't know;
- **allow several answers:** `multiple`, where an `exclusive` option such as "None of these" clears the others;
- **be conditional:** `when.answer` shows it only after a particular earlier answer, for example "Is there blood in the vomit?" only after answering Yes to "Are you vomiting?". Each area has 1–3 conditional questions, so people usually see 5–7 of the 8.

To add or change questions, edit the data files. The screens don't need changes.

- **Editing from the review:** tapping a row on 2.7 opens that step with `?edit=1`. Its main button then returns to the review instead of moving forward.
- **What `/predict` receives:** `symptoms` (the chips, or the typed text if no chips were picked), `follow_up_answers` (question id → selected options), `age`, `sex` and `duration_days`. Everything else (description, body area, the full follow-up questions and answers, severity, trend, high-risk groups, health profile) goes in `notes`. See [src/intake/request.ts](src/intake/request.ts) and [Symptom prediction](#symptom-prediction).

## Symptom prediction

The ML model ranks what it recognizes; Claude weighs that ranking against everything else and makes the final call.

1. **Matching** ([backend/app/prediction/symptom_map.py](../backend/app/prediction/symptom_map.py)): the backend matches `symptoms` and `follow_up_answers` to the model's dataset symptoms (e.g. "Rash" → `skin_rash`, "Sneezing" on the cold-symptoms question → `continuous_sneezing`). Reported symptoms with no match go into an **unmatched** list. Chips with no match today: Ear pain, Eye pain, Hoarse voice, Numbness or tingling, Swelling, Pain when breathing.
2. **Ranking** ([backend/app/prediction/ml_model.py](../backend/app/prediction/ml_model.py)): the LightGBM model from `backend/ml_layer/` returns the top 5 conditions. It only knows 41 diseases.
3. **Claude** ([backend/app/prediction/claude_client.py](../backend/app/prediction/claude_client.py)) receives the reported symptoms, the model's candidates, the symptoms the ranking used, the coverage (e.g. "2 of 3 reported symptoms"), the unmatched symptoms and `notes`. Its prompt tells it to give the ranking less weight when coverage is low, to include conditions outside the ranking when the answers point there, and to base urgency on everything reported, escalating for red flags.
4. **Response:** Claude's result (`conditions`, `urgency`, `recommended_specialty`, `advice`, `disclaimer`) plus `model_candidates` (name, probability, `match_score`), `model_symptoms` and `unmatched_symptoms`. The results screen shows them in a "Model ranking" box with a "Not in the model" line.

Example: Rash + Fatigue + Ear pain. The model ranks dengue first from rash and fatigue alone; Claude puts a viral rash and an ear infection first, keeps dengue as low likelihood because no fever was reported, and recommends seeing a doctor.

Tests are in [backend/tests/test_predict_ml.py](../backend/tests/test_predict_ml.py). One of them checks that every mapped name is a real dataset symptom.

## Next steps

1. **Walk through the app in Expo Go** on a phone (see [Running on a phone](#running-on-a-phone)): Welcome → consent → Home → intake → results, against the Figma frames.
2. **Get the symptom mappings and follow-up questions reviewed** (see Open questions).
3. **Update the Figma file** to match the no-login decision: the consent claims and the 1.6 tracker note listed under Privacy, and "of 6" on the profile progress bar (the app shows "of 5" because 1.8 Language is hidden).
4. **Match the remaining ported screens to Figma** (Emergency 3.2, Feedback 4.6). 3.1, 3.6 and 4.4 are built from their frames.
5. **Build the scaffolds** (Providers, Pharmacy, Medication chat, Profile); each lists what it needs.
6. **Add a chat endpoint** to the backend for the medication chat (4.1) and the diagnosis chat (4.2).
7. **Decide History and the tracker** (4.3, 4.7) now that nothing is saved, then port or drop the screens left in `src/screens/`.
8. **Set `GOOGLE_PLACES_API_KEY`** in the root `.env` before building Providers and Pharmacy.
