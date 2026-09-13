import Link from "next/link";
import { getAdminContactSettings, getAdminProjects, getAdminServices } from "../../lib/admin/data";

const cards = [
  ["Content", "Update headings, descriptions, statistics, and visible website text.", "/admin/content"],
  ["Services", "Edit the existing service cards and Power Supply entries.", "/admin/services"],
  ["Projects", "Edit the existing completed project information.", "/admin/projects"],
  ["Media", "Replace website images without changing the public layout.", "/admin/media"],
  ["Logos", "Replace the main, partner, and client logos.", "/admin/logos"],
  ["Contact & Social", "Keep phone, WhatsApp, email, and social links current.", "/admin/contact"],
] as const;

export default async function AdminDashboardPage() {
  const [services, projects, contact] = await Promise.all([getAdminServices(), getAdminProjects(), getAdminContactSettings()]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4a7b1d]">Saudi IT Mart</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#111827]">Website Admin</h1>
        <p className="mt-2 text-zinc-600">Manage the existing website content from one focused workspace.</p>
      </header>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-5"><div className="text-3xl font-black text-[#111827]">{services.length}</div><div className="mt-1 text-sm text-zinc-500">Services</div></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5"><div className="text-3xl font-black text-[#111827]">{projects.length}</div><div className="mt-1 text-sm text-zinc-500">Projects</div></div>
        <div className="rounded-2xl border border-black/5 bg-white p-5"><div className="truncate text-lg font-bold text-[#111827]">{contact?.email || "Not configured"}</div><div className="mt-1 text-sm text-zinc-500">Primary email</div></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, description, href]) => <Link key={href} href={href} className="rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#9bdc62] hover:shadow-[0_12px_30px_rgba(17,24,39,0.08)]"><h2 className="text-xl font-bold text-[#111827]">{title}</h2><p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p><span className="mt-5 inline-flex text-sm font-semibold text-[#4a7b1d]">Open section →</span></Link>)}
      </div>
    </div>
  );
}
