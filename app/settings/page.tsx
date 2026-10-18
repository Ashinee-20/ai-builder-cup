"use client";

import { AppShell } from "@/components/app-shell";
import { useDemo } from "@/components/demo-provider";

export default function SettingsPage() {
  const { state, resetDemo } = useDemo();
  return <AppShell workflow="Plan"><div className="page-head"><div><div className="eyebrow">Workspace controls</div><h1 className="page-title">Settings</h1><p>Preferences, demo data and retention controls.</p></div></div><div className="split"><section className="card panel"><h2>Teaching preferences</h2><label className="label">Display name<input className="transcript" style={{minHeight:44,marginTop:6}} defaultValue={state.teacherName}/></label><label className="label" style={{display:"block",marginTop:18}}>Preferred teaching language<select className="transcript" style={{minHeight:44,marginTop:6}} defaultValue="English"><option>English</option><option>Hindi</option></select></label><button className="btn btn-primary" style={{marginTop:20}}>Save preferences</button></section><aside className="stack"><div className="card panel"><h3>Demo isolation</h3><p className="small muted">Visitor ID: {state.visitorId}. This prototype stores synthetic state in this browser only.</p><button className="btn" onClick={resetDemo}>Reset synthetic demo</button></div><div className="card panel"><h3>Recording retention</h3><p className="small muted">No recording bytes are persisted in fixture mode. Production deletion requires private Storage and server-side derived-data cleanup.</p><button className="btn" disabled>Delete recordings</button></div></aside></div></AppShell>;
}
