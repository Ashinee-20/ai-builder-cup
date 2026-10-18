import { z } from "zod";

const listFromText = (value: unknown) => typeof value === "string"
  ? value.split(/\n|;/).map((item) => item.replace(/^[-*]\s*/, "").trim()).filter(Boolean)
  : value;
const stringList = (minimum: number, maximum: number, itemMaximum = 300) => z.preprocess(
  listFromText,
  z.array(z.string().min(1).max(itemMaximum)).min(minimum).max(maximum),
);

export const TimetableEntrySchema = z.object({
  day: z.string().min(2).max(20),
  period: z.preprocess((value) => value == null ? "Unspecified" : String(value), z.string().min(1).max(30)),
  startTime: z.string().min(1).max(20),
  endTime: z.preprocess((value) => value == null ? "" : value, z.string().max(20)).default(""),
  className: z.string().min(1).max(100),
  subject: z.string().min(1).max(100),
  room: z.preprocess((value) => value == null ? "" : value, z.string().max(60)).default(""),
  confidence: z.enum(["high", "medium", "low"]),
  notes: z.preprocess((value) => value == null ? "" : value, z.string().max(1000)).default(""),
});

export const LessonActivitySchema = z.object({
  minutes: z.number().int().min(1).max(180),
  title: z.string().min(1).max(120),
  detail: z.string().min(1).max(600),
});

export const LessonQuestionSchema = z.object({
  prompt: z.string().min(1).max(500),
  options: z.array(z.string().min(1).max(200)).length(4),
  answerIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1).max(500),
});

export const LessonPlanSchema = z.object({
  id: z.string().min(1).max(120),
  className: z.string().min(1).max(100),
  subject: z.string().min(1).max(100),
  title: z.string().min(1).max(160),
  chapter: z.string().min(1).max(160),
  scheduleDay: z.string().min(1).max(20),
  startTime: z.string().min(1).max(20),
  durationMinutes: z.number().int().min(15).max(180),
  objective: z.string().min(10).max(1000),
  outcomes: stringList(1, 6),
  activities: z.array(LessonActivitySchema).min(3).max(8),
  materials: stringList(0, 10, 200),
  assessment: stringList(1, 6),
  homework: z.string().min(1).max(600),
  teacherNotes: stringList(0, 6),
  quiz: z.array(LessonQuestionSchema).min(3).max(5),
});

export const PlanningResultSchema = z.object({
  summary: z.preprocess(
    (value) => typeof value === "string" ? value : JSON.stringify(value),
    z.string().min(1).max(5000),
  ),
  warnings: stringList(0, 12, 2000),
  schedule: z.array(TimetableEntrySchema).min(1).max(100),
  lessonPlans: z.array(LessonPlanSchema).min(1).max(24),
});

export type GeneratedLessonPlan = z.infer<typeof LessonPlanSchema>;
export type PlanningResult = z.infer<typeof PlanningResultSchema>;

export interface SavedPlanningWorkspace extends PlanningResult {
  teacherName: string;
  academicYear: string;
  curriculum: string;
  language: string;
  sourceFileName: string;
  sourceMimeType: string;
  model: string;
  generatedAt: string;
  persistence: "firestore" | "not_saved";
}

export const planningResponseJsonSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    warnings: { type: "array", maxItems: 12, items: { type: "string" } },
    schedule: {
      type: "array", minItems: 1, maxItems: 100,
      items: { type: "object", properties: {
        day: { type: "string" }, period: { type: "string" }, startTime: { type: "string" }, endTime: { type: "string" },
        className: { type: "string" }, subject: { type: "string" }, room: { type: "string" },
        confidence: { type: "string", enum: ["high", "medium", "low"] }, notes: { type: "string" },
      }, required: ["day", "period", "startTime", "endTime", "className", "subject", "room", "confidence", "notes"] },
    },
    lessonPlans: {
      type: "array", minItems: 1, maxItems: 24,
      items: { type: "object", properties: {
        id: { type: "string" }, className: { type: "string" }, subject: { type: "string" }, title: { type: "string" },
        chapter: { type: "string" }, scheduleDay: { type: "string" }, startTime: { type: "string" },
        durationMinutes: { type: "integer", minimum: 15, maximum: 180 }, objective: { type: "string" },
        outcomes: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } },
        activities: { type: "array", minItems: 3, maxItems: 8, items: { type: "object", properties: {
          minutes: { type: "integer" }, title: { type: "string" }, detail: { type: "string" },
        }, required: ["minutes", "title", "detail"] } },
        materials: { type: "array", maxItems: 10, items: { type: "string" } },
        assessment: { type: "array", minItems: 1, maxItems: 6, items: { type: "string" } },
        homework: { type: "string" },
        teacherNotes: { type: "array", maxItems: 6, items: { type: "string" } },
        quiz: { type: "array", minItems: 3, maxItems: 5, items: { type: "object", properties: {
          prompt: { type: "string" }, options: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
          answerIndex: { type: "integer", minimum: 0, maximum: 3 }, explanation: { type: "string" },
        }, required: ["prompt", "options", "answerIndex", "explanation"] } },
      }, required: ["id", "className", "subject", "title", "chapter", "scheduleDay", "startTime", "durationMinutes", "objective", "outcomes", "activities", "materials", "assessment", "homework", "teacherNotes", "quiz"] },
    },
  },
  required: ["summary", "warnings", "schedule", "lessonPlans"],
} as const;

