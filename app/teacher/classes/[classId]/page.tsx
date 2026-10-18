import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function ClassDetail() {
  return <AppShell workflow="Plan"><div className="page-head"><div><div className="eyebrow">Grade 8 · Mathematics A</div><h1 className="page-title">Rational Numbers</h1><p>Demo curriculum · original sample content, not a verified textbook edition.</p></div><Link href="/teacher/classes/math-8a/insights" className="btn">View insights <ArrowRight size={15}/></Link></div>
    <div className="metric-row" style={{marginBottom:20}}><div className="metric"><strong>18</strong><span>enrolled</span></div><div className="metric"><strong>2</strong><span>scheduled lessons</span></div><div className="metric"><strong>1</strong><span>packet to review</span></div><div className="metric"><strong>40</strong><span>minutes per period</span></div></div>
    <div className="card panel"><div className="resource-head"><h2 style={{margin:0}}>Chapter allocation</h2><span className="status blue">Version 1</span></div><div className="activity-list"><div className="activity"><div className="activity-minutes">17 Oct</div><div><strong>Rational numbers: the big idea</strong><span className="muted small">Definition, examples and equivalent fractions</span></div></div><div className="activity"><div className="activity-minutes">19 Oct</div><div><strong>Comparing on the number line</strong><span className="muted small">Ordering, signs and a short diagnostic</span></div></div><div className="activity"><div className="activity-minutes">21 Oct</div><div><strong>Buffer and revision</strong><span className="muted small">Reserved for evidence-led reteaching</span></div></div></div></div>
  </AppShell>;
}
