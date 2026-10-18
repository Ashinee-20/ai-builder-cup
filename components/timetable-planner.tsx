"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Download, ExternalLink, FileUp, LoaderCircle, RefreshCw, Sparkles } from "lucide-react";
import type { GeneratedLessonPlan, SavedPlanningWorkspace } from "@/lib/planning";

type FormLink = { formId: string; editUrl: string; responderUri: string; questionCount: number };

async function readJson(response: Response) {
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : `Request failed (${response.status}).`);
  return payload;
}

export function TimetablePlanner() {
  const [accessCode, setAccessCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [teacherName, setTeacherName] = useState("Meera Joshi");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [curriculum, setCurriculum] = useState("NCERT; create the next practical lesson for each class and subject");
  const [language, setLanguage] = useState("English");
  const [workspace, setWorkspace] = useState<SavedPlanningWorkspace | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [error, setError] = useState("");
  const [forms, setForms] = useState<Record<string, FormLink>>({});
  const [formBusy, setFormBusy] = useState("");

  useEffect(() => { setAccessCode(window.sessionStorage.getItem("chalkevo-access-code") || ""); }, []);

  function headers() {
    window.sessionStorage.setItem("chalkevo-access-code", accessCode);
    return { "x-chalkevo-access-code": accessCode };
  }

  async function generate() {
    if (!accessCode.trim()) { setError("Enter the workspace access code."); return; }
    if (!file) { setError("Choose your timetable image, PDF, or CSV first."); return; }
    setBusy(true); setError(""); setWorkspace(null); setForms({});
    try {
      const body = new FormData();
      body.append("timetable", file); body.append("teacherName", teacherName); body.append("academicYear", academicYear);
      body.append("curriculum", curriculum); body.append("language", language);
      const response = await fetch("/api/timetable", { method: "POST", headers: headers(), body });
      setWorkspace(await readJson(response) as unknown as SavedPlanningWorkspace);
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Plan generation failed."); }
    finally { setBusy(false); }
  }

  async function loadSaved() {
    if (!accessCode.trim()) { setError("Enter the workspace access code."); return; }
    setLoadingSaved(true); setError("");
    try {
      const response = await fetch("/api/timetable/latest", { headers: headers(), cache: "no-store" });
      setWorkspace(await readJson(response) as unknown as SavedPlanningWorkspace);
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Saved plan could not be loaded."); }
    finally { setLoadingSaved(false); }
  }

  async function createForm(lesson: GeneratedLessonPlan) {
    setFormBusy(lesson.id); setError("");
    try {
      const response = await fetch("/api/forms/quiz", { method: "POST", headers: { ...headers(), "content-type": "application/json" }, body: JSON.stringify(lesson) });
      const link = await readJson(response) as unknown as FormLink;
      setForms((current) => ({ ...current, [lesson.id]: link }));
    } catch (problem) { setError(problem instanceof Error ? problem.message : "Google Form creation failed."); }
    finally { setFormBusy(""); }
  }

  function downloadPlan() {
    if (!workspace) return;
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "chalkevo-lesson-plans.json"; anchor.click(); URL.revokeObjectURL(url);
  }

  return <div className="stack" style={{gap:22}}>
    <section className="card panel">
      <div className="resource-head"><div><div className="eyebrow">Gemini timetable intelligence</div><h2 style={{margin:"5px 0"}}>Upload timetable and build lesson plans</h2></div><Sparkles color="var(--heat)"/></div>
      <p className="muted">Upload a clear timetable. Gemini extracts the schedule, creates classroom-ready plans and quizzes, and saves the latest workspace in Firestore.</p>
      <div className="planner-form">
        <label className="label">Workspace access code<input type="password" className="transcript compact-input" value={accessCode} onChange={(event)=>setAccessCode(event.target.value)} autoComplete="current-password" placeholder="Enter demo access code"/></label>
        <label className="label">Teacher name<input className="transcript compact-input" value={teacherName} onChange={(event)=>setTeacherName(event.target.value)}/></label>
        <label className="label">Academic year<input className="transcript compact-input" value={academicYear} onChange={(event)=>setAcademicYear(event.target.value)}/></label>
        <label className="label">Output language<select className="transcript compact-input" value={language} onChange={(event)=>setLanguage(event.target.value)}><option>English</option><option>Hindi</option><option>Kannada</option><option>Tamil</option><option>Telugu</option><option>Marathi</option></select></label>
        <label className="label planner-wide">Curriculum, board or topic guidance<textarea className="transcript planner-notes" value={curriculum} onChange={(event)=>setCurriculum(event.target.value)} /></label>
        <label className="upload-drop planner-wide"><FileUp size={24}/><strong>{file ? file.name : "Choose timetable image, PDF or CSV"}</strong><span className="small muted">JPG, PNG, WebP, PDF or CSV / maximum 8 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,text/csv,text/plain,.csv,.txt" onChange={(event)=>setFile(event.target.files?.[0] || null)}/></label>
      </div>
      {error && <div className="callout" style={{marginTop:18}} role="alert"><h3>Could not complete that action</h3><p>{error}</p></div>}
      <div className="hero-actions"><button className="btn btn-primary" onClick={generate} disabled={busy}>{busy ? <><LoaderCircle className="spin" size={16}/> Gemini is reading and planning...</> : <><Sparkles size={16}/> Generate lesson plans</>}</button><button className="btn" onClick={loadSaved} disabled={loadingSaved}>{loadingSaved ? <LoaderCircle className="spin" size={16}/> : <RefreshCw size={16}/>} Load latest from Firestore</button></div>
    </section>

    {workspace && <>
      <section className="callout success-callout"><div className="resource-head" style={{margin:0}}><div><h3>{workspace.lessonPlans.length} lesson plan{workspace.lessonPlans.length === 1 ? "" : "s"} generated</h3><p>{workspace.summary}</p></div><button className="btn btn-small" onClick={downloadPlan}><Download size={14}/> Download JSON</button></div><div className="source-line">Live {workspace.model} / {workspace.persistence === "firestore" ? "saved in Firestore" : "not saved"} / {new Date(workspace.generatedAt).toLocaleString()}</div></section>
      {workspace.warnings.length > 0 && <section className="card panel"><h3>Review these assumptions</h3><ul className="note-list">{workspace.warnings.map((warning)=><li key={warning}>{warning}</li>)}</ul></section>}
      <section className="card panel"><div className="resource-head"><div><div className="label">Extracted timetable</div><h2 style={{margin:"5px 0"}}>{workspace.schedule.length} teaching slots</h2></div><CalendarDays color="var(--heat)"/></div><div className="table-wrap"><table className="schedule-table"><thead><tr><th>Day</th><th>Time</th><th>Period</th><th>Class</th><th>Subject</th><th>Confidence</th></tr></thead><tbody>{workspace.schedule.map((slot,index)=><tr key={`${slot.day}-${slot.period}-${index}`}><td>{slot.day}</td><td>{slot.startTime}{slot.endTime ? `-${slot.endTime}` : ""}</td><td>{slot.period}</td><td>{slot.className}</td><td>{slot.subject}</td><td><span className={`status ${slot.confidence === "high" ? "green" : slot.confidence === "low" ? "orange" : "amber"}`}>{slot.confidence}</span></td></tr>)}</tbody></table></div></section>
      <section className="stack"><div><div className="label">Gemini lesson plans</div><h2 style={{margin:"5px 0"}}>Ready to review and teach</h2></div>{workspace.lessonPlans.map((lesson)=><details className="card lesson-plan" key={lesson.id}><summary><span><span className="status blue">{lesson.className} / {lesson.subject}</span><strong>{lesson.title}</strong><span className="muted small">{lesson.scheduleDay} {lesson.startTime} / {lesson.durationMinutes} minutes</span></span><span className="small muted">Open plan</span></summary><div className="lesson-plan-body"><div className="callout"><h3>Objective</h3><p>{lesson.objective}</p></div><div className="plan-columns"><div><h3>Learning outcomes</h3><ul className="note-list">{lesson.outcomes.map((item)=><li key={item}>{item}</li>)}</ul></div><div><h3>Materials</h3><ul className="note-list">{lesson.materials.map((item)=><li key={item}>{item}</li>)}</ul></div></div><h3>Teaching sequence</h3><div className="activity-list">{lesson.activities.map((activity)=><div className="activity" key={`${activity.minutes}-${activity.title}`}><div className="activity-minutes">{activity.minutes} min</div><div><strong>{activity.title}</strong><span className="small muted">{activity.detail}</span></div></div>)}</div><div className="plan-columns"><div><h3>Assessment</h3><ul className="note-list">{lesson.assessment.map((item)=><li key={item}>{item}</li>)}</ul></div><div><h3>Homework</h3><p>{lesson.homework}</p></div></div><div className="resource-head form-action"><div><h3>Google Forms quiz</h3><p className="muted small">Create an auto-graded form from the {lesson.quiz.length} Gemini-generated questions.</p></div>{forms[lesson.id] ? <div className="hero-actions"><a className="btn btn-primary btn-small" href={forms[lesson.id].responderUri} target="_blank" rel="noreferrer">Open student form <ExternalLink size={14}/></a><a className="btn btn-small" href={forms[lesson.id].editUrl} target="_blank" rel="noreferrer">Edit form <ExternalLink size={14}/></a></div> : <button className="btn btn-primary" onClick={()=>createForm(lesson)} disabled={Boolean(formBusy)}>{formBusy === lesson.id ? <LoaderCircle className="spin" size={16}/> : <Check size={16}/>} Create Google Form</button>}</div></div></details>)}</section>
    </>}
  </div>;
}

