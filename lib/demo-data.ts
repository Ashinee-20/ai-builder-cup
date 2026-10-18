import type { DemoState, Lesson } from "./types";

export const DEMO_LESSONS: Lesson[] = [
  {
    id: "rational-numbers-foundations",
    title: "Rational numbers: the big idea",
    chapter: "Rational Numbers",
    date: "Today",
    time: "09:10",
    duration: 40,
    status: "needs_review",
    objective: "Recognise a rational number as a number expressible as p/q, where q is not zero.",
    activities: [
      { minutes: 5, label: "Number line warm-up", detail: "Place −2, 0, ½ and 2 on a shared number line." },
      { minutes: 12, label: "Build the definition", detail: "Compare whole numbers, integers and fractions using p/q." },
      { minutes: 15, label: "Worked examples", detail: "Classify 3/4, −5, 0.6 and √2 with reasons." },
      { minutes: 8, label: "Exit check", detail: "Students construct two equivalent rational numbers." },
    ],
    transcript:
      "A rational number can be written as p divided by q, where p and q are integers and q cannot be zero. For example, negative five is rational because it can be written as negative five over one. Decimal 0.6 is rational because it equals three fifths. The denominator condition matters because division by zero is undefined.",
    packetState: "ready_for_review",
    packetVersion: 1,
    notes: [
      "A rational number is any number that can be written as p/q, where p and q are integers and q ≠ 0.",
      "Integers are rational: −5 = −5/1. Terminating decimals are rational: 0.6 = 3/5.",
      "Equivalent fractions name the same point: 1/2 = 2/4 = 50/100.",
    ],
    memoryMap: [
      { label: "Rational numbers", children: ["p/q form", "q ≠ 0"] },
      { label: "Examples", children: ["integers", "fractions", "terminating decimals"] },
      { label: "Same value", children: ["equivalent fractions", "same number-line point"] },
    ],
    quiz: [
      {
        id: "q1",
        prompt: "Which number is rational?",
        options: ["√2", "π", "−7", "√3"],
        answer: 2,
        explanation: "−7 can be written as −7/1, so it is rational.",
      },
      {
        id: "q2",
        prompt: "Why is q ≠ 0 required in p/q?",
        options: ["Zero is not an integer", "Division by zero is undefined", "p must be positive", "Fractions cannot contain zero"],
        answer: 1,
        explanation: "A denominator of zero would require division by zero, which is undefined.",
      },
      {
        id: "q3",
        prompt: "Which fraction is equivalent to 3/5?",
        options: ["6/15", "9/10", "12/20", "15/30"],
        answer: 2,
        explanation: "Multiplying numerator and denominator by 4 gives 12/20.",
      },
    ],
  },
  {
    id: "rational-number-line",
    title: "Comparing on the number line",
    chapter: "Rational Numbers",
    date: "Tomorrow",
    time: "09:10",
    duration: 40,
    status: "planned",
    objective: "Compare and order rational numbers using a number line.",
    activities: [
      { minutes: 6, label: "Retrieval", detail: "Recall the p/q definition with two student examples." },
      { minutes: 12, label: "Number-line model", detail: "Partition intervals and locate signed fractions." },
      { minutes: 14, label: "Pair challenge", detail: "Order four rational numbers and justify placements." },
      { minutes: 8, label: "Check and reflect", detail: "One-item diagnostic and correction." },
    ],
    transcript: "",
    packetState: "draft",
    packetVersion: 1,
    notes: [],
    memoryMap: [],
    quiz: [],
  },
];

export function createDemoState(visitorId = "demo-local"): DemoState {
  return {
    visitorId,
    teacherName: "Meera Joshi",
    className: "Grade 8 · Mathematics A",
    packetPublished: false,
    attempts: [],
    evidence: [],
    revisionState: "proposed",
    lessons: structuredClone(DEMO_LESSONS),
  };
}
