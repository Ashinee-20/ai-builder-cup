"use client";

import Link from "next/link";
import { ArrowRight, Bell, BookOpen, Clock3, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useDemo } from "@/components/demo-provider";
import { insightCounts } from "@/lib/insights";

export default function TeacherToday() {
  const { state } = useDemo();
  const counts = insightCounts(state);
  return <AppShell workflow="Review">
    <div className="page-head"><div><div className="eyebrow">Saturday, 17 October</div><h1 className="page-title">Good morning, Meera.</h1><p>Two lessons today. One packet is waiting for your review.</p></div><Link href="/teacher/lessons/rational-numbers-foundations" className="btn btn-primary"><Sparkles size={16}/> Review learning packet</Link></div>
    {state.evidence.length > 0 && <div className="callout" style={{marginBottom:20}}><div className="resource-head"><div><h3>New learning evidence is ready</h3><p>{counts.statuses.likely_misconception + counts.statuses.incomplete} of {counts.responded} live respondents need a follow-up. {counts.pending} students have not responded.</p></div><Link href="/teacher/classes/math-8a/insights" className="btn btn-small">Inspect evidence <ArrowRight size={14}/></Link></div></div>}
    <div className="dashboard-grid">
      <section className="stack"><div className="label">Today&apos;s teaching</div>
        <article className="card lesson-card"><div className="time-block"><strong>09:10</strong><span className="small muted">40 min</span></div><div><span className="status orange">Ready to review</span><h3>Rational numbers: the big idea</h3><div className="meta-row"><span><Users size={13} style={{display:"inline"}}/> Grade 8 A</span><span><BookOpen size={13} style={{display:"inline"}}/> Mathematics</span></div></div><Link href="/teacher/lessons/rational-numbers-foundations" className="btn btn-small">Open lesson</Link></article>
        <article className="card lesson-card"><div className="time-block"><strong>11:20</strong><span className="small muted">40 min</span></div><div><span className="status green">Plan approved</span><h3>Algebraic expressions: like terms</h3><div className="meta-row"><span><Users size={13} style={{display:"inline"}}/> Grade 7 B</span><span><Clock3 size={13} style={{display:"inline"}}/> Starts in 2h 10m</span></div></div><button className="btn btn-small" disabled title="This secondary demo lesson is not included">Start lesson</button></article>
      </section>
      <aside className="stack">
        <div className="card panel"><div className="resource-head"><div><div className="label">Review queue</div><h3 style={{margin:"5px 0"}}>1 packet waiting</h3></div><Bell size={19} color="var(--heat)"/></div><p className="muted small">Notes, quiz and concept map generated from your saved recap.</p><Link href="/teacher/lessons/rational-numbers-foundations" className="btn btn-small">Review now <ArrowRight size={14}/></Link></div>
        <div className="card panel"><div className="label">Tomorrow</div><h3 style={{margin:"5px 0"}}>Comparing on the number line</h3><p className="muted small">A 40-minute plan is ready. Student evidence can update it after publication.</p><Link href="/teacher/lessons/rational-number-line/revision" className="btn btn-small">View proposed plan</Link></div>
        <div className="card panel"><div className="label">Demo source</div><h3 style={{margin:"5px 0"}}>Fixture mode</h3><p className="muted small">All classroom data is synthetic. AI results are clearly labelled and no Google request is being simulated.</p></div>
      </aside>
    </div>
  </AppShell>;
}
