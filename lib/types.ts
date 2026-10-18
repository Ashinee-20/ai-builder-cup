export type PacketState = "draft" | "ready_for_review" | "published";
export type UnderstandingStatus =
  | "demonstrated"
  | "likely_misconception"
  | "incomplete"
  | "insufficient_evidence";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapter: string;
  date: string;
  time: string;
  duration: number;
  status: "planned" | "taught" | "needs_review";
  objective: string;
  activities: { minutes: number; label: string; detail: string }[];
  transcript: string;
  packetState: PacketState;
  packetVersion: number;
  notes: string[];
  memoryMap: { label: string; children: string[] }[];
  quiz: QuizQuestion[];
}

export interface QuizAttempt {
  lessonId: string;
  answers: Record<string, number>;
  score: number;
  submittedAt: string;
  packetVersion: number;
}

export interface ExplanationEvidence {
  lessonId: string;
  response: string;
  quotedSpan: string;
  understandingStatus: UnderstandingStatus;
  inputQuality: "usable" | "uncertain_transcription";
  nextAction: "follow_up" | "finish" | "teacher_review";
  reasoningSummary: string;
  createdAt: string;
  modelVersion: string;
}

export interface DemoState {
  visitorId: string;
  teacherName: string;
  className: string;
  packetPublished: boolean;
  attempts: QuizAttempt[];
  evidence: ExplanationEvidence[];
  revisionState: "proposed" | "accepted" | "rejected";
  lessons: Lesson[];
}
