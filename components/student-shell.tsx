import Link from "next/link";
import { Brand } from "./brand";

export function StudentShell({ children }: { children: React.ReactNode }) {
  return <div className="student-shell">
    <header className="student-top"><div className="container-wide student-top-inner"><Link href="/"><Brand /></Link><nav className="student-nav"><Link href="/student">My Classes</Link><Link href="/student">Today&apos;s Learning</Link><Link href="/student">My Progress</Link></nav><span className="status blue">Student demo</span></div></header>
    <main className="student-content">{children}</main>
  </div>;
}
