import { getAdminLogos } from "../../../lib/admin/data";
import { PageHeading } from "../components/page-heading";
import { AddLogoForm, LogoCard } from "./logo-form";

export default async function AdminLogosPage() {
  const logos = await getAdminLogos();
  const groups = (["main", "partner", "client"] as const).map((logoType) => ({ logoType, logos: logos.filter((logo) => logo.logo_type === logoType) }));
  return <div className="mx-auto max-w-6xl"><PageHeading eyebrow="Website logos" title="Logos" description="Add, replace, reorder, or remove main, partner, and client logos." /><AddLogoForm />{groups.map((group) => <section key={group.logoType} className="mb-8"><h2 className="mb-4 text-lg font-bold capitalize text-[#111827]">{group.logoType} logos</h2>{group.logos.length === 0 ? <p className="rounded-xl border border-dashed border-black/15 bg-white p-4 text-sm text-zinc-600">No {group.logoType} logos yet.</p> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{group.logos.map((logo, index) => <LogoCard key={logo.id} logo={logo} position={index + 1} total={group.logos.length} />)}</div>}</section>)}</div>;
}