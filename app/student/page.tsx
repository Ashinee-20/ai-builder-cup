"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole } from "lucide-react";
import { StudentShell } from "@/components/student-shell";
import { useDemo } from "@/components/demo-provider";

export default function StudentHome() {
  const { state } = useDemo();
  return <StudentShell><div className="page-head"><div><div className="eyebrow">Today&apos;s learning</div><h1 className="page-title">Hi, Aarav.</h1><p>Continue with the resources your teacher has approved.</p></div></div>
    {!state.packetPublished ? <div className="card panel" style={{textAlign:"center", padding:"64px 24px"}}><LockKeyhole size={32} color="var(--muted)"/><h2>No new lesson yet</h2><p className="muted">Your teacher is still reviewing today&apos;s learning packet.</p><Link href="/teacher/lessons/rational-numbers-foundations" className="btn">Return to teacher review</Link></div> : <Link href="/student/lessons/rational-numbers-foundations" className="card panel" style={{display:"block"}}><div className="resource-head"><div><span className="status orange">Ready for you</span><h2 style={{margin:"12px 0 5px"}}>Rational numbers: the big idea</h2><p className="muted" style={{margin:0}}>Notes · 3-question check · memory map · explain it</p></div><ArrowRight/></div><div className="meta-row"><span><BookOpen size={14}/> Grade 8 Mathematics A</span><span>Packet v1</span></div></Link>}
  </StudentShell>;
}
