import { AppShell } from "@/components/app-shell";
import { TimetablePlanner } from "@/components/timetable-planner";

export default function PlannerPage() {
  return <AppShell workflow="Plan">
    <div className="page-head"><div><div className="eyebrow">Live AI workspace</div><h1 className="page-title">Planner</h1><p>Turn your real timetable into saved, classroom-ready lesson plans.</p></div></div>
    <TimetablePlanner />
  </AppShell>;
}
