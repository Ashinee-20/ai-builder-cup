"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Check, LockKeyhole, Mic, Send } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { useDemo } from "@/components/demo-provider";
import { classifyExplanation } from "@/lib/insights";

type Tab = "notes" | "quiz" | "map" | "explain";

export default function StudentLesson({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const { state, saveAttempt, saveEvidence } = useDemo();
  const lesson = state.lessons.find((item) => item.id === lessonId) || state.lessons[0];
  const existingAttempt = state.attempts.find((item) => item.lessonId === lesson.id);
  const [tab, setTab] = useState<Tab>("notes");
  const [answers, setAnswers] = useState<Record<string, number>>(existingAttempt?.answers || {});
  const [submitted, setSubmitted] = useState(Boolean(existingAttempt));
  const [response, setResponse] = useState("");
  const [agentReply, setAgentReply] = useState("");

  if (!state.packetPublished) return <StudentShell><div className="card panel" style={{textAlign:"center",padding:"60px 24px"}}><LockKeyhole size={32}/><h1>This packet is not published</h1><p className="muted">Students cannot retrieve teacher drafts or answer keys.</p><Link className="btn" href="/student">Back to learning</Link></div></StudentShell>;

  function submitQuiz() {
    if (Object.keys(answers).length !== lesson.quiz.length) return;
    const score = lesson.quiz.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
    saveAttempt({ lessonId: lesson.id, answers, score, submittedAt: new Date().toISOString(), packetVersion: lesson.packetVersion });
    setSubmitted(true);
  }

  function submitExplanation() {
    const result = classifyExplanation(response);
    saveEvidence({ lessonId: lesson.id, response, ...result, createdAt: new Date().toISOString(), modelVersion: "fixture-rules-v1" });
    if (result.inputQuality === "uncertain_transcription") setAgentReply("I may not have heard that correctly. Please edit the words above so they match what you meant.");
    else if (result.understandingStatus === "demonstrated") setAgentReply("That works: you gave the p/q form, protected the denominator from zero, and connected it to an example.");
    else if (result.understandingStatus === "likely_misconception") setAgentReply("Let’s test one part: what would 3 ÷ 0 have to mean? Can you place its result on a number line?");
    else setAgentReply("You have part of it. What must be true about p and q, and why can q not be zero?");
  }

  return <StudentShell><div className="page-head"><div><div className="eyebrow">Grade 8 · Mathematics</div><h1 className="page-title">{lesson.title}</h1><p>Published packet v{lesson.packetVersion}</p></div><span className="status green">Teacher approved</span></div>
    <div className="tabs"><button className={`tab ${tab==="notes"?"active":""}`} onClick={()=>setTab("notes")}>Notes</button><button className={`tab ${tab==="quiz"?"active":""}`} onClick={()=>setTab("quiz")}>Quiz {submitted && "✓"}</button><button className={`tab ${tab==="map"?"active":""}`} onClick={()=>setTab("map")}>Memory map</button><button className={`tab ${tab==="explain"?"active":""}`} onClick={()=>setTab("explain")}>Explain it</button></div>
    {tab === "notes" && <article className="card panel"><h2>What makes a number rational?</h2><ul className="note-list">{lesson.notes.map((note)=><li key={note}>{note}</li>)}</ul><div className="callout" style={{marginTop:24}}><h3>Try it</h3><p>Write −4 and 0.75 in p/q form. Remember: q cannot be zero.</p></div></article>}
    {tab === "quiz" && <section className="card panel"><div className="resource-head"><div><div className="label">Diagnostic check</div><h2 style={{margin:"4px 0"}}>Show what makes sense so far</h2></div>{submitted && <span className="status green">Submitted</span>}</div>{lesson.quiz.map((question,index)=><div className="quiz-question" key={question.id}><strong>{index+1}. {question.prompt}</strong><div className="options">{question.options.map((option,optionIndex)=><label className="option" key={option}><input type="radio" name={question.id} checked={answers[question.id]===optionIndex} disabled={submitted} onChange={()=>setAnswers({...answers,[question.id]:optionIndex})}/><span>{option}</span></label>)}</div>{submitted && <div className="feedback"><strong>{answers[question.id]===question.answer ? "Correct." : `The answer is ${question.options[question.answer]}.`}</strong> {question.explanation}</div>}</div>)}<button className="btn btn-primary" disabled={submitted || Object.keys(answers).length !== lesson.quiz.length} onClick={submitQuiz}>{submitted ? <><Check size={16}/> Submitted</> : "Submit answers"}</button>{submitted && <p className="small muted">Saved against packet v{lesson.packetVersion}. Your teacher sees the result, not the answer key before you submit.</p>}</section>}
    {tab === "map" && <section><div className="page-head"><div><h2 style={{margin:0}}>Build the idea in three parts</h2><p>Use the branches to recall the definition and test examples.</p></div></div><div className="concept-map">{lesson.memoryMap.map((node)=><div className="concept-node" key={node.label}><strong>{node.label}</strong>{node.children.map(child=><span key={child}>→ {child}</span>)}</div>)}</div></section>}
    {tab === "explain" && <section className="explain-box"><div className="agent-message"><strong>ChalkEvo asks</strong><p style={{marginBottom:0}}>Explain what a rational number is, give an example, and tell me why it fits.</p></div><div className="explain-compose"><label className="label" htmlFor="explanation">Your explanation</label><textarea id="explanation" value={response} onChange={(event)=>setResponse(event.target.value)} placeholder="A rational number is…"/><div className="resource-head" style={{marginTop:12,marginBottom:0}}><button className="btn" disabled title="Voice transcription needs browser speech support in a live deployment"><Mic size={16}/> Push to talk</button><button className="btn btn-primary" onClick={submitExplanation} disabled={response.trim().length < 2}><Send size={15}/> Send explanation</button></div>{agentReply && <div className="callout" style={{marginTop:16}}><h3>One useful next step</h3><p>{agentReply}</p><div className="source-line">Fixture assessment · formative only · you can edit and send again</div></div>}</div></section>}
  </StudentShell>;
}
