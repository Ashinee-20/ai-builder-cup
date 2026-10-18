# ChalkEvo

ChalkEvo turns a teacher timetable into Gemini-generated lesson plans and quizzes, saves the latest workspace in Firestore, and carries classroom evidence into the next lesson. This is a functional prototype for the Google Cloud AI Builder Cup 2026.

**Live deployment:** https://chalkevo-icrkm2pvoq-uc.a.run.app

## What works

- Responsive landing page and teacher/student workspaces.
- Real timetable upload for JPG, PNG, WebP, PDF, CSV and text files.
- Live Gemini extraction and classroom-ready lesson-plan generation.
- Server-side Firestore save/load for the latest protected teacher workspace.
- Google Forms quiz creation from each generated lesson (requires Google user OAuth).
- Teacher review gate: unpublished packets are inaccessible in the student route.
- Saved quiz attempts and formative explanation evidence in isolated browser storage.
- Evidence dashboard with explicit denominators and no invented mastery score.
- Duration-validated revision accept/reject flow and an optional live Gemini endpoint.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000/teacher/planner`, enter the configured workspace code, upload `fixtures/timetable.csv`, and generate plans. You can also approve a packet, switch to the student view, submit the quiz and an explanation, then return to Insights.

```bash
npm test
npm run typecheck
npm run build
```

## Live Google services

Production uses Vertex AI through the Cloud Run runtime identity. `POST /api/timetable` accepts a multipart timetable and planning preferences, calls Gemini, validates the response, and stores the latest result in Firestore. Protected planner routes require `x-chalkevo-access-code`; this is a shared prototype access code, not teacher-account authentication. Google Forms credentials are injected from Secret Manager and are never committed.

See [architecture](docs/architecture.md), [deployment](docs/deployment.md), and [build status](docs/build-status.md). Use synthetic or consented timetable data for evaluation; this prototype is not a privacy certification or classroom validation.
