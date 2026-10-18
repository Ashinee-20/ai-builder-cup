import assert from "node:assert/strict";
import test from "node:test";
import { classifyExplanation } from "../lib/insights";
import { canApplyRevision, validateDuration } from "../lib/revision";

test("a concise correct explanation is demonstrated", () => {
  const result = classifyExplanation("A rational number is p/q for two integers, q cannot be zero; for example 3/5.");
  assert.equal(result.understandingStatus, "demonstrated");
});

test("uncertain transcription asks for review", () => {
  const result = classifyExplanation("Transcript unclear ?? rational number maybe");
  assert.equal(result.inputQuality, "uncertain_transcription");
  assert.equal(result.nextAction, "teacher_review");
});

test("zero-denominator misconception is not treated as mastery", () => {
  const result = classifyExplanation("A fraction is rational and the denominator can be zero because zero is an integer.");
  assert.equal(result.understandingStatus, "likely_misconception");
});

test("revision duration must exactly fit the period", () => {
  assert.deepEqual(validateDuration([{ minutes: 8 }, { minutes: 12 }, { minutes: 12 }, { minutes: 8 }], 40), { total: 40, availableMinutes: 40, valid: true, overBy: 0 });
  assert.equal(validateDuration([{ minutes: 25 }, { minutes: 20 }], 40).valid, false);
});

test("stale or repeated revision acceptance is rejected", () => {
  assert.equal(canApplyRevision(2, 3, "proposed"), false);
  assert.equal(canApplyRevision(3, 3, "accepted"), false);
  assert.equal(canApplyRevision(3, 3, "proposed"), true);
});
