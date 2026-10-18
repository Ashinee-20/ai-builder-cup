# Cloud Run deployment

## Current deployment

- Project: `sahayak-ai-cup-2026`
- Region: `us-central1`
- Service: `chalkevo`
- URL: `https://chalkevo-icrkm2pvoq-uc.a.run.app`
- Ready revision: `chalkevo-00011-hrw`
- Runtime identity: `sahayak-runtime@sahayak-ai-cup-2026.iam.gserviceaccount.com`
- Image: `us-central1-docker.pkg.dev/sahayak-ai-cup-2026/chalkevo/web@sha256:3a7f54cd2a0354842e13f92fa71ddff7733a0a85d383057698c35e3d5fa0101d`
- Firestore: Native mode `(default)`, `us-central1`
- Private bucket: `gs://sahayak-ai-cup-2026-private` with public access prevention
- AI: Vertex AI `gemini-2.5-flash`; protected by a Secret Manager workspace access code
- Planner persistence: Firestore document `chalkevo_workspaces/public_demo`
- Google Forms: API enabled; OAuth credentials and refresh token injected from Secret Manager

1. Select an authorized project; enable Cloud Run, Artifact Registry, Vertex AI, Cloud Tasks, Firebase/Firestore, and Storage.
2. Use a least-privilege service account and workload identity; never commit a key file.
3. Build: `gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT/sahayak/web:VERSION`.
4. Deploy on port 8080 with `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, and `GEMINI_MODEL`; inject secrets through Secret Manager.
5. Configure Firebase domains/rules/indexes, a private bucket, and an OIDC-authenticated Tasks queue.
6. Add budgets/rate limits and verify the full synthetic flow at desktop and mobile widths.

The public prototype is deployed. Timetable upload, Gemini planning, and Firestore persistence are connected. The Forms adapter still needs a replacement Google OAuth Desktop client because the OneAwaaz OAuth client was deleted. The Cloud Tasks worker and per-teacher account isolation remain separate production work.
