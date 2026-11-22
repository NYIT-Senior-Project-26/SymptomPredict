# Screens not ported yet

These four screens came from the React Navigation version of the app. The app uses
Expo Router (routes in `app/`), so these files are **not used** and are excluded from
the type check in `tsconfig.json`.

They show saved past sessions, but the team decided not to store any health data
(see `frontend/PROGRESS.md`, Privacy). Port them once the team decides what they
should show when nothing is saved.

| File | Figma | Route it would replace |
|---|---|---|
| `DiagnosisTimelineScreen.tsx` | 4.3 Session History | `app/(tabs)/history.tsx` |
| `SessionSummaryScreen.tsx` | 4.3 Session History | `app/(tabs)/history.tsx` |
| `ChronicTrackerScreen.tsx` | 4.7 Chronic Condition Tracker | `app/tracker.tsx` |
| `DoctorFacingPDFScreen.tsx` | 4.4 Doctor-Facing PDF | none (a generated document; see `app/export.tsx`) |

When porting one, follow the screens in `app/results/`: use Expo Router (`router.push`),
the theme in `src/theme`, and the shared building blocks in `src/components/` and the results pieces in `src/results/components.tsx`.
Then delete the file here.
