"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, CalendarDays, ChevronDown, ClipboardCheck, GraduationCap, Home, Menu, Settings, Users } from "lucide-react";
import { Brand } from "./brand";
import { WorkflowIndicator } from "./workflow-indicator";
import { useDemo } from "./demo-provider";

const nav = [
  { href: "/teacher", label: "Today", icon: Home },
  { href: "/teacher/classes", label: "Classes", icon: Users },
  { href: "/teacher/planner", label: "Planner", icon: CalendarDays },
  { href: "/teacher/lessons/rational-numbers-foundations", label: "Review Queue", icon: ClipboardCheck },
  { href: "/teacher/classes/math-8a/insights", label: "Insights", icon: BarChart3 },
];

export function AppShell({ children, workflow = "Review" }: { children: React.ReactNode; workflow?: string }) {
  const pathname = usePathname();
  const { state } = useDemo();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/"><Brand /></Link>
      <div className="nav-group-label">Workspace</div>
      <nav className="side-nav" aria-label="Teacher navigation">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/teacher" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`}><Icon size={18} aria-hidden="true" /><span>{label}</span></Link>;
        })}
      </nav>
      <div className="nav-group-label">Account</div>
      <nav className="side-nav"><Link href="/settings" className="nav-link"><Settings size={18} /><span>Settings</span></Link><Link href="/student" className="nav-link"><GraduationCap size={18} /><span>Student view</span></Link></nav>
      <div className="side-bottom"><div className="profile"><div className="avatar">MJ</div><div><strong className="small">{state.teacherName}</strong><div className="small muted">AI workspace</div></div></div></div>
    </aside>
    <main className="app-main">
      <div className="app-top">
        <button className="btn btn-quiet icon-btn mobile-menu" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}><Menu size={20} /></button>
        <WorkflowIndicator current={workflow} />
        <button className="btn btn-small"><BookOpen size={15} /> {state.className}<ChevronDown size={14} /></button>
      </div>
      {mobileOpen ? <nav className="mobile-drawer" aria-label="Mobile teacher navigation">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="nav-link" onClick={() => setMobileOpen(false)}><Icon size={18}/><span>{label}</span></Link>)}<Link href="/student" className="nav-link"><GraduationCap size={18}/><span>Student view</span></Link></nav> : null}
      <div className="app-content">{children}</div>
    </main>
  </div>;
}
