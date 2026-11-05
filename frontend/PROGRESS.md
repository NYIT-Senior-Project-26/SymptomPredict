# Frontend Progress

_Last updated: 2026-10-29_

Status of the Expo app: what is built, what is still a placeholder, and what comes next. The screens are built from the DiagnosisCloud designs on page 1 of the [Figma file](https://www.figma.com/design/6DFreMInyAv75dL3sLb8G0/Untitled?node-id=0-1).

## Summary

| Area | Status |
|---|---|
| Expo SDK | ✅ SDK 58; `expo-doctor` passes 20/20 checks |
| Routing (Expo Router) | ✅ All 30 visible Figma screens have a route |
| Design tokens (colors, fonts) | ✅ Taken from Figma variables |
| Shared components | ✅ All components from the Figma components frame |
| Symptom check (`/predict`) | ✅ Connected: text input → analyzing → result |
| Screen designs | ❌ Most screens are still placeholders |
| Saved profile / onboarding state | ❌ Not built; every launch starts at onboarding |
| Tested on a device | ❔ Type check and iOS bundle pass; not yet opened in Expo Go |

## Running the app

```
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go. The project is on **SDK 58**, so Expo Go must be the SDK 58 version. If you see errors from an old cache, run `npx expo start -c`.

The symptom check needs the backend running, with `ANTHROPIC_API_KEY` set (see [BUILD_STATUS.md](../BUILD_STATUS.md)). On a phone, set `EXPO_PUBLIC_API_URL` in `frontend/.env` to your computer's local IP address, not `localhost`.

## Project layout

```
frontend/
├── app/                  Routes (one file per screen, Expo Router)
│   ├── _layout.tsx       Root stack: loads fonts, sets the header, lists every route
│   ├── (onboarding)/     Welcome, consent
│   ├── setup/            Profile setup steps
│   ├── (tabs)/           Home, History, Chat, Profile (bottom tab bar)
│   ├── intake/           Symptom intake steps and the analyzing screen
│   ├── results/          Triage result, providers, pharmacy, emergency, condition detail
│   ├── chat/             Diagnosis and medication chatbots
│   └── components.tsx    Component gallery (development only)
├── assets/               Logo and icons exported from Figma
└── src/
    ├── api/client.ts     Backend API calls
    ├── components/       Shared components
    ├── state/intake.tsx  Holds intake answers and the prediction result
    └── theme/index.ts    Colors and fonts
```

Use the `@/` alias for anything in `src/`, for example `import { colors } from '@/theme'`.

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

**Placeholder** means the route exists and the navigation buttons work, but the Figma design hasn't been built yet.

| # | Figma frame | Route | Status |
|---|---|---|---|
| 1.1 | Splash / Welcome | `/welcome` | Placeholder |
| 1.2 | Privacy & Data Consent | `/consent` | Placeholder |
| 1.3 | Profile · Basic info | `/setup/basic` | Placeholder |
| 1.4 | Profile · Allergies | `/setup/allergies` | Placeholder |
| 1.5 | Profile · Medications | `/setup/medications` | Placeholder |
| 1.6 | Profile · Ongoing conditions | `/setup/conditions` | Placeholder |
| 1.7 | Profile · Insurance | `/setup/insurance` | Placeholder |
| 2.1 | Home Dashboard | `/home` | Placeholder (header and tab bar done) |
| 2.2 | Intake · Chief complaint | `/intake` | Working, not styled to the design |
| 2.3 | Intake · Body map | `/intake/body-map` | Placeholder |
| 2.4 | Intake · Follow-up question | `/intake/follow-up` | Placeholder |
| 2.5 | Intake · Severity & duration | `/intake/severity` | Placeholder |
| 2.6 | Intake · High-risk check | `/intake/high-risk` | Placeholder |
| 2.7 | Intake · Confirmation summary | `/intake/summary` | Placeholder |
| 2.8 | Loading / Analysis | `/intake/analyzing` | Working (calls `/predict`), not styled to the design |
| 3.1a–c | Triage Result (3 versions) | `/results` | Working; shows `TriageBadge`, rest not styled |
| 3.2 | Emergency Escalation | `/results/emergency` | Placeholder |
| 3.3 | Provider Recommendations | `/results/providers` | Placeholder |
| 3.5 | Pharmacy & OTC | `/results/pharmacy` | Placeholder |
| 3.6a–b | Condition Detail | `/results/condition/[name]` | Placeholder |
| 4.1 | Medication Chatbot | `/chat/medication` | Placeholder |
| 4.2 | Diagnosis Chatbot | `/chat/diagnosis` | Placeholder |
| 4.3 | Session History | `/history` (tab) | Placeholder |
| 4.5 | Export & Share Sheet | `/export` | Placeholder |
| 4.6 | Post-Diagnosis Feedback | `/feedback` | Placeholder |
| 4.7 | Chronic Condition Tracker | `/tracker` | Placeholder |
| 4.8 | Profile & Settings | `/profile` (tab) | Placeholder |

**Not included:**
- **1.8 Language** and **3.4 Virtual Visit:** hidden in Figma.
- **4.4 Doctor-Facing PDF:** a generated document, not an app screen.

## Open questions

- **Match percentage:** `DiagnosisCard` shows a match like "82%", but `/predict` returns only `low` / `medium` / `high` likelihood. Either the API returns a number, or the card shows the likelihood level instead. Until this is decided, the results screen doesn't use the card.
- **Chat tab:** it currently lets you choose between the diagnosis and medication chatbots. Should one of them be the tab itself?
- **Tab headers:** History, Chat and Profile use a plain title header for now. They will be matched to their own frames when those screens are built.

## Next steps

1. **Open the app in Expo Go** and compare the component gallery with the Figma components frame.
2. **Build Onboarding (1.1–1.7)** from the Figma frames.
3. **Save the profile** so returning users skip onboarding and land on Home.
4. **Build Home and Intake (2.1–2.8)**, splitting the text-only chief complaint into the staged intake from the design, and send the extra answers (severity, duration) to `/predict`.
5. **Build Results & Care (3.x).** Decide the match percentage question first, then use `DiagnosisCard` and build its expanded state from 3.1a. Connect providers to `api.nearbyProviders` and pharmacy to `api.searchMedication`.
6. **Build Chat, History & Follow-up (4.x).** History depends on the backend saving symptom checks (not built yet, see [BUILD_STATUS.md](../BUILD_STATUS.md)).
