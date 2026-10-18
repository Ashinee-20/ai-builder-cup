"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CircleStop, FileText, GitFork, Mic, Play, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useDemo } from "@/components/demo-provider";

type Tab = "plan" | "recording" | "packet";

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const { state, publishPacket } = useDemo();
  const lesson = state.lessons.find((item) => item.id === lessonId) || state.lessons[0];
  const [tab, setTab] = useState<Tab>(lesson.packetState === "ready_for_review" ? "packet" : "plan");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [micError, setMicError] = useState("");
  const [published, setPublished] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  async function toggleRecording() {
    if (recording) {
      recorder.current?.stop();
      recorder.current?.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
      return;
    }
    setMicError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicError("Browser recording is unavailable here. Paste a teacher recap instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const instance = new MediaRecorder(stream);
      instance.start(); recorder.current = instance; setElapsed(0); setRecording(true);
    } catch {
      setMicError("Microphone access was denied. You can still paste a teacher-only recap below.");
    }
  }

  function handlePublish() {
    publishPacket(); setPublished(true);
  }

  return <AppShell workflow={tab === "plan" ? "Plan" : tab === "recording" ? "Teach" : "Review"}>
    <div className="page-head"><div><div className="eyebrow">Grade 8 · Mathematics · {lesson.date}</div><h1 className="page-title">{lesson.title}</h1><p>{lesson.duration} minutes · {lesson.chapter} · Demo curriculum</p></div><span className={`status ${state.packetPublished ? "green" : "orange"}`}>{state.packetPublished ? "Published · v1" : "Ready for review · v1"}</span></div>
    <div className="tabs" role="tablist"><button className={`tab ${tab === "plan" ? "active" : ""}`} onClick={() => setTab("plan")}>Lesson plan</button><button className={`tab ${tab === "recording" ? "active" : ""}`} onClick={() => setTab("recording")}>Recording & transcript</button><button className={`tab ${tab === "packet" ? "active" : ""}`} onClick={() => setTab("packet")}>Learning packet <span className="status orange">3</span></button></div>
    {tab === "plan" && <div className="split"><section className="card panel"><div className="label">Objective</div><h2 style={{fontSize:25, lineHeight:1.25}}>{lesson.objective}</h2><div className="activity-list">{lesson.activities.map((item) => <div className="activity" key={item.label}><div className="activity-minutes">{item.minutes} min</div><div><strong>{item.label}</strong><span className="muted small">{item.detail}</span></div></div>)}</div></section><aside className="stack"><div className="card panel"><div className="label">Duration check</div><h3 style={{margin:"5px 0"}}>{lesson.activities.reduce((sum,item)=>sum+item.minutes,0)} / {lesson.duration} minutes</h3><p className="small muted">Activities fit the available period exactly.</p><span className="status green">Validated</span></div><div className="card panel"><div className="label">Source</div><p className="small">Original demo curriculum: Rational Numbers, objective RN-1.</p><span className="status blue">Fixture source</span></div></aside></div>}
    {tab === "recording" && <div className="split"><section className="card panel"><div className="resource-head"><div><div className="label">Classroom audio</div><h2 style={{margin:"5px 0"}}>Record or add a recap</h2></div><span className={`status ${recording ? "orange" : ""}`}>{recording ? "Recording" : "Not recording"}</span></div><div className="recording"><button className="record-dot" onClick={toggleRecording} aria-label={recording ? "Stop recording" : "Start recording"}>{recording ? <CircleStop/> : <Mic/>}</button><div><strong>{recording ? `00:${String(elapsed).padStart(2,"0")}` : "Microphone ready"}</strong><div className="small muted">{recording ? "Audio stays in this browser demo and is not uploaded." : "Start only after confirming consent."}</div></div></div>{micError && <div className="callout" style={{marginTop:12}}><p>{micError}</p></div>}<label className="label" htmlFor="recap" style={{display:"block",margin:"22px 0 8px"}}>Editable teacher recap</label><textarea id="recap" className="transcript" defaultValue={lesson.transcript}/><div className="source-line">Fixture transcript · direct transcription is not claimed · no audio retained</div></section><aside className="card panel"><ShieldCheck color="var(--heat)"/><h3>Before you record</h3><p className="muted small">Confirm your school&apos;s consent process, explain who may be captured, and use the retention controls for real classroom data.</p><button className="btn" disabled><Play size={15}/> Process recording</button><p className="small muted">Live processing needs configured Google credentials and private storage.</p></aside></div>}
    {tab === "packet" && <div className="split"><section className="resource-list"><div className="resource"><div className="resource-head"><div><span className="label">01 · Student notes</span><h3>What makes a number rational?</h3></div><span className="status green">Source checked</span></div><ul className="note-list">{lesson.notes.map((note) => <li key={note}>{note}</li>)}</ul><div className="source-line">Based on recap segment 1 and demo objective RN-1 · Fixture generated</div></div><div className="resource"><div className="resource-head"><div><span className="label">02 · Diagnostic quiz</span><h3>{lesson.quiz.length} questions with feedback</h3></div><FileText size={18}/></div><p className="muted">Checks the ratio form, non-zero denominator, and equivalent fractions. Answer key is withheld from students until submission.</p><div className="source-line">Teacher preview includes answer key · Fixture generated</div></div><div className="resource"><div className="resource-head"><div><span className="label">03 · Concept map</span><h3>Definition → examples → equivalent forms</h3></div><GitFork size={18}/></div><p className="muted">A constrained map is used instead of generated HTML.</p><div className="source-line">Based on approved demo curriculum · Fixture generated</div></div></section><aside className="stack"><div className="card panel"><div className="label">Publication gate</div><h3 style={{margin:"6px 0"}}>{state.packetPublished ? "Students can now view v1" : "Nothing is shared yet"}</h3><p className="muted small">Publishing locks this version. Future edits create a new draft.</p><button className="btn btn-primary" onClick={handlePublish} disabled={state.packetPublished}><Check size={16}/>{state.packetPublished ? "Published" : "Approve & publish"}</button>{state.packetPublished && <Link className="btn" style={{marginTop:8}} href="/student/lessons/rational-numbers-foundations">Open student view <ArrowRight size={14}/></Link>}</div><div className="card panel"><Sparkles color="var(--heat)"/><h3>Review flags</h3><p className="small muted">No unsupported claims found. Confirm the 0.6 example matches how it was taught.</p></div></aside></div>}
    {published && <div className="toast">Packet v1 published to Grade 8 Mathematics A.</div>}
  </AppShell>;
}
