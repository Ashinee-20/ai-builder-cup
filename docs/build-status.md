# Build status - 18 October 2026

## Completed

- Next.js/TypeScript/Tailwind app and locked dependencies.
- Landing, onboarding, teacher dashboard/classes/planner/lesson/insights/revision, student learning, and settings.
- Synthetic two-lesson loop with browser persistence, publication gate, quiz, evidence, and revision decision.
- Protected live Gemini endpoint with validation and explicit failure; Docker/config/rules/docs/fixtures included.
- Original generated ChalkEvo logo saved at `public/logo.png` and used as the navigation mark and favicon.
- Google Cloud project `sahayak-ai-cup-2026`, Firestore Native database, private upload bucket, Artifact Registry, Secret Manager token, and Cloud Run service.
- Protected timetable upload, live Gemini extraction, generated lesson plans/quizzes, and Firestore save/load are connected in the Planner UI.
- Google Forms quiz adapter is deployed with secrets migrated from OneAwaaz; the legacy OAuth client was deleted and must be replaced once in Google Cloud before form creation succeeds.

## Verified

- `npm test`: 5 of 5 focused checks passed.
- `npm run typecheck`: passed with no TypeScript errors.
- `npm run build`: production build passed; all application and API routes compiled.
- Local production server: landing page returned HTTP 200.
- Headless Edge screenshots inspected at 1440×1000 and 390×844; mobile overflow was corrected.
- Browser smoke: unpublished packet blocked; teacher publication unlocked it; quiz scored 3/3; concise explanation was demonstrated; teacher responded count updated to 1.
- `npm audit --omit=dev`: 0 production vulnerabilities after upgrading to Next.js 16.4.2.
- Cloud Build `06e86c19-9b0b-48fd-9778-2278536b8438`: succeeded.
- Cloud Run revision `chalkevo-00011-hrw`: Ready, 100% traffic, max scale 3.
- Public deployment: `https://chalkevo-icrkm2pvoq-uc.a.run.app` returned HTTP 200 with ChalkEvo branding and logo.
- Anonymous AI request returned 401; authorized live Vertex AI smoke returned a validated `gemini-2.5-flash` packet with 6 notes, 4 questions, and 3 concept-map nodes.
- End-to-end CSV smoke: 2 timetable rows extracted, 2 lesson plans generated with `gemini-2.5-flash`, saved to Firestore, and loaded back successfully.
- `GET /health` returns HTTP 200 and reports Gemini configured.

## Remaining external setup

- Per-teacher authentication is intentionally omitted for the prototype; expensive and account-mutating routes use a shared workspace access code.
- Create a new Google OAuth Desktop client, authorize the Forms scopes, and replace the two Forms secrets; the OneAwaaz client referenced by its refresh token has been deleted.
- Cloud Tasks API is enabled, but no durable worker/queue is deployed yet.
- Real curriculum/audio: only original/synthetic sources are included.

## Deferred

- Production repository layer/Admin verification; durable worker, upload chunking, transcript timestamps and deletion cascade.
- Teacher correction UI for extracted timetable cells, notifications, and multi-workspace isolation.
- Emulator security tests and full accessibility/browser screenshot audit if unavailable here.
