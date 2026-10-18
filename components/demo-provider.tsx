"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createDemoState } from "@/lib/demo-data";
import type { DemoState, ExplanationEvidence, QuizAttempt } from "@/lib/types";

const STORAGE_KEY = "sahayak-demo-v1";

interface DemoContextValue {
  state: DemoState;
  ready: boolean;
  publishPacket: () => void;
  saveAttempt: (attempt: QuizAttempt) => void;
  saveEvidence: (evidence: ExplanationEvidence) => void;
  decideRevision: (decision: "accepted" | "rejected") => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(() => createDemoState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setState(JSON.parse(stored) as DemoState); } catch { window.localStorage.removeItem(STORAGE_KEY); }
    } else setState(createDemoState(`demo-${Math.random().toString(36).slice(2, 10)}`));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const publishPacket = useCallback(() => setState((current) => ({
    ...current,
    packetPublished: true,
    lessons: current.lessons.map((lesson) => lesson.id === "rational-numbers-foundations" ? { ...lesson, packetState: "published" } : lesson),
  })), []);
  const saveAttempt = useCallback((attempt: QuizAttempt) => setState((current) => ({ ...current, attempts: [...current.attempts.filter((item) => item.lessonId !== attempt.lessonId), attempt] })), []);
  const saveEvidence = useCallback((evidence: ExplanationEvidence) => setState((current) => ({ ...current, evidence: [...current.evidence, evidence] })), []);
  const decideRevision = useCallback((decision: "accepted" | "rejected") => setState((current) => ({ ...current, revisionState: decision })), []);
  const resetDemo = useCallback(() => setState(createDemoState(`demo-${Math.random().toString(36).slice(2, 10)}`)), []);
  const value = useMemo(() => ({ state, ready, publishPacket, saveAttempt, saveEvidence, decideRevision, resetDemo }), [state, ready, publishPacket, saveAttempt, saveEvidence, decideRevision, resetDemo]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
