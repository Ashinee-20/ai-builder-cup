import type { DemoState, ExplanationEvidence, UnderstandingStatus } from "./types";

export function classifyExplanation(input: string): Pick<ExplanationEvidence, "understandingStatus" | "inputQuality" | "nextAction" | "reasoningSummary" | "quotedSpan"> {
  const normalized = input.trim().toLowerCase();
  if (!normalized || normalized.split(/\s+/).length < 4) {
    return { understandingStatus: "insufficient_evidence", inputQuality: "usable", nextAction: "follow_up", reasoningSummary: "The response is too brief to show the defining relationship.", quotedSpan: input.trim() };
  }
  if (/transcript|unclear|could not hear|\?\?/.test(normalized)) {
    return { understandingStatus: "insufficient_evidence", inputQuality: "uncertain_transcription", nextAction: "teacher_review", reasoningSummary: "The interpreted words are uncertain; confirm the transcript before assessment.", quotedSpan: input.trim() };
  }
  if (/denominator.*zero|q.*zero.*allow|divide by zero.*fine/.test(normalized)) {
    return { understandingStatus: "likely_misconception", inputQuality: "usable", nextAction: "follow_up", reasoningSummary: "The response appears to allow a zero denominator, which conflicts with the definition.", quotedSpan: input.trim() };
  }
  const hasForm = /(fraction|p\s*\/\s*q|ratio|two integers|over)/.test(normalized);
  const hasExample = /(example|like|such as|\d+\s*\/\s*\d+|integer|−|-\d)/.test(normalized);
  const protectsZero = /(not zero|non.?zero|cannot be zero|isn'?t zero)/.test(normalized);
  if (hasForm && hasExample && protectsZero) {
    return { understandingStatus: "demonstrated", inputQuality: "usable", nextAction: "finish", reasoningSummary: "The student states the integer ratio form, gives an example, and preserves the non-zero denominator condition.", quotedSpan: input.trim() };
  }
  return { understandingStatus: "incomplete", inputQuality: "usable", nextAction: "follow_up", reasoningSummary: "The response shows part of the concept but does not yet justify all conditions.", quotedSpan: input.trim() };
}

export function insightCounts(state: DemoState) {
  const roster = 18;
  const statuses: Record<UnderstandingStatus, number> = {
    demonstrated: 0,
    likely_misconception: 0,
    incomplete: 0,
    insufficient_evidence: 0,
  };
  for (const item of state.evidence) statuses[item.understandingStatus] += 1;
  const responded = new Set([
    ...state.attempts.map(() => "live-student"),
    ...state.evidence.map(() => "live-student"),
  ]).size;
  return { roster, responded, pending: roster - responded, statuses };
}
