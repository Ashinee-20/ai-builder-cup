# Architecture

## Intended production flow

1. Next.js runs on Cloud Run. Firebase Authentication issues tokens; each server route verifies identity and tenant/class membership.
2. Firestore stores typed records and immutable packet versions. Transactions guard publish, submission, and revision acceptance.
3. Private Cloud Storage holds consented uploads.
4. A request first persists an idempotent job, then Cloud Tasks invokes an authenticated worker with OIDC.
5. Small services call Gemini through `@google/genai`; JSON is schema-constrained and Zod-validated.
6. The worker writes resources and a notification. Publication remains a separate teacher action.

```text
Browser → Cloud Run web/API → Firebase Auth + Firestore
                       ├──→ private Cloud Storage
                       └──→ Cloud Tasks → authenticated worker → Gemini
                                                └──→ versioned results
```

## Current prototype

The UI loop runs with synthetic per-browser `localStorage`. `POST /api/ai/packet` is a real server-only Gemini integration, protected by the `x-sahayak-ai-key` header when `SAHAYAK_AI_ACCESS_TOKEN` is configured, but is not wired to production persistence. Firebase rules/indexes are starting points. Auth/Admin verification, Firestore repositories, uploads, durable jobs, audit logs, and emulator tests remain required before real student data.

Planned records: User, AcademicYear, ClassGroup, ClassMembership, TeachingAssignment, TimetableSlot, CalendarException, CurriculumSource, Chapter, LearningObjective, ChapterAllocation, Lesson, LessonPlanVersion, Recording, TranscriptSegment, ProcessingJob, LearningPacketVersion, QuizAttempt, ExplanationSession, AssessmentEvidence, InsightSnapshot, RevisionProposal, Notification, AuditEvent.
