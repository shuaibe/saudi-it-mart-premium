import Link from "next/link";
import { logoutAdmin } from "../../../lib/admin/actions";

const links = [
  ["Dashboard", "/admin"],
  ["Content", "/admin/content"],
  ["Services", "/admin/services"],
  ["Projects", "/admin/projects"],
  ["Media", "/admin/media"],
  ["Logos", "/admin/logos"],
  ["Contact & Social", "/admin/contact"],
] as const;

export function AdminNav() {
  return (
    <aside className="border-b border-black/10 bg-[#0f1720] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-white/10">
      <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block">
        <Link href="/admin" className="text-lg font-black tracking-tight">Saudi IT Mart</Link>
        <span className="rounded-full bg-[#aef06c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f1720]">Admin</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:px-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white lg:mb-1">
            {label}
          </Link>
        ))}
      </nav>
      <form action={logoutAdmin} className="px-3 pb-5 lg:mt-auto">
        <button type="submit" className="w-full rounded-xl border border-white/15 px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">Log out</button>
      </form>
    </aside>
  );
}
