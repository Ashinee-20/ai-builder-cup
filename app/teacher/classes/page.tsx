import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function ClassesPage() {
  return <AppShell workflow="Plan"><div className="page-head"><div><div className="eyebrow">Your teaching</div><h1 className="page-title">Classes</h1><p>Active teaching assignments for the 2026–27 academic year.</p></div><button className="btn" disabled>Add class</button></div>
    <div className="stack"><Link href="/teacher/classes/math-8a" className="card panel"><div className="resource-head"><div><span className="status green">Active</span><h2 style={{margin:"10px 0 4px"}}>Grade 8 · Mathematics A</h2><div className="meta-row"><span><Users size={14}/> 18 synthetic students</span><span><BookOpen size={14}/> Rational Numbers</span></div></div><ArrowRight/></div></Link><div className="card panel" style={{opacity:.66}}><span className="status">Demo preview only</span><h2 style={{margin:"10px 0 4px"}}>Grade 7 · Mathematics B</h2><p className="muted">Secondary fixture included to demonstrate multi-class navigation.</p></div></div>
  </AppShell>;
}
