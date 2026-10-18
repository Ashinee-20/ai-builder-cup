import Link from "next/link";
import { ArrowRight, BookOpenCheck, BrainCircuit, Check, CircleGauge, Sparkles, WandSparkles } from "lucide-react";
import { Brand } from "@/components/brand";

const workflow = [
  ["01", "Plan", "Shape a focused lesson from your curriculum, timetable, and what the class already knows."],
  ["02", "Teach", "Capture a teacher recap or consented recording. Keep every source segment reviewable."],
  ["03", "Review", "Edit notes, diagnostic questions, and a concept map before anything reaches students."],
  ["04", "Learn", "Students answer, explain in their own words, and get one useful follow-up at a time."],
  ["05", "Adapt", "See the evidence behind each insight and adjust tomorrow’s lesson without losing the original."],
];

export default function LandingPage() {
  return <main>
    <header className="topbar"><div className="container-wide topbar-inner"><Brand /><nav className="landing-nav" aria-label="Main navigation"><a href="#workflow">How it works</a><Link href="/student">Student view</Link><Link href="/teacher/planner" className="btn btn-small">Open teacher workspace</Link></nav></div></header>
    <section className="hero grid-bg">
      <div className="container-wide hero-layout">
        <div>
          <div className="eyebrow">A teacher-led learning loop</div>
          <h1>Turn today&apos;s teaching into tomorrow&apos;s <em>understanding.</em></h1>
          <p className="hero-copy">Plan lessons, share teacher-approved learning resources, and use student explanations to shape what comes next.</p>
          <div className="hero-actions"><Link href="/teacher/planner" className="btn btn-primary">Upload your timetable <ArrowRight size={17} /></Link><a href="#workflow" className="btn">See the workflow</a></div>
          <div className="hero-note"><span><Check size={14} style={{display:"inline", verticalAlign:"-2px"}} /> Teacher approves every packet</span><span><Check size={14} style={{display:"inline", verticalAlign:"-2px"}} /> Evidence, not opaque scores</span></div>
        </div>
        <div className="card preview-card" aria-label="Interactive lesson adaptation preview">
          <div className="preview-head"><div><div className="label">Tomorrow · Grade 8</div><strong>Comparing rational numbers</strong></div><span className="status orange">Adaptation proposed</span></div>
          <div className="mini-plan">
            <div className="mini-row"><div className="mini-time">6 min</div><div className="mini-content"><strong>Retrieval warm-up</strong><div className="small muted">Recall the p/q definition</div></div></div>
            <div className="mini-row"><div className="mini-time">8 min</div><div className="mini-content hot"><strong>Added · denominator clinic</strong><div className="small muted">Contrast 3/5 with 3/0 using a number line</div></div></div>
            <div className="mini-row"><div className="mini-time">18 min</div><div className="mini-content"><strong>Guided comparison</strong><div className="small muted">Shortened by 4 minutes</div></div></div>
          </div>
          <div className="insight-strip"><BrainCircuit size={19} color="#ff8a55" /><span><strong>Why this changed</strong><br /><span style={{opacity:.72}}>4 of 11 respondents treated zero as a valid denominator. Seven have not responded.</span></span></div>
        </div>
      </div>
    </section>
    <div className="logo-strip"><div className="container-wide">Designed for the complete daily cycle · plan → teach → review → learn → adapt</div></div>
    <section id="workflow" className="workflow-section"><div className="container-wide">
      <div className="workflow-head"><div><div className="eyebrow">One connected day</div><h2 className="section-title">The lesson doesn&apos;t end<br />when the bell rings.</h2></div><p className="hero-copy" style={{maxWidth:460}}>ChalkEvo turns what was actually taught into an approved learning packet, then brings student thinking back into the next plan.</p></div>
      <div className="workflow-grid">{workflow.map(([num,title,copy]) => <article className="workflow-step" key={title}><span className="step-num">{num}</span><h3>{title}</h3><p className="muted">{copy}</p></article>)}</div>
    </div></section>
    <section className="workflow-section" style={{paddingTop:20}}><div className="container-wide"><div className="split">
      <div><div className="eyebrow">Teacher control, by design</div><h2 className="section-title">AI drafts. Teachers decide.</h2><p className="hero-copy">Generated notes, questions, and adaptations stay in a review queue. Published versions remain identifiable, and accepting a revision never erases the original plan.</p><div className="hero-actions"><Link href="/teacher/lessons/rational-numbers-foundations" className="btn">Open the review queue <ArrowRight size={16}/></Link></div></div>
      <div className="stack"><div className="card panel"><BookOpenCheck color="var(--heat)"/><h3>Approval is enforced</h3><p className="muted">Students only see a packet after explicit publication. Answer keys remain hidden until submission.</p></div><div className="card panel"><CircleGauge color="var(--heat)"/><h3>Counts stay honest</h3><p className="muted">Pending students never enter misunderstanding totals. Small samples are labelled partial.</p></div></div>
    </div></div></section>
    <section className="cta-band"><div className="container-wide cta-layout"><div><div className="eyebrow" style={{color:"#ff9b70"}}>Live Gemini workspace</div><h2 className="section-title" style={{marginTop:10}}>Turn your timetable into a teaching plan.</h2></div><Link href="/teacher/planner" className="btn btn-primary"><WandSparkles size={17}/> Generate lesson plans</Link></div></section>
    <footer style={{padding:"28px 0"}}><div className="container-wide topbar-inner"><Brand/><span className="small muted">Prototype for Google Cloud AI Builder Cup 2026 · synthetic data only</span></div></footer>
  </main>;
}
