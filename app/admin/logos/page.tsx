import { getAdminLogos } from "../../../lib/admin/data";
import { AssetUploadForm } from "../components/asset-upload-form";
import { PageHeading } from "../components/page-heading";

export default async function AdminLogosPage() {
  const logos = await getAdminLogos();
  return <div className="mx-auto max-w-6xl"><PageHeading eyebrow="Existing displayed logos" title="Logos" description="Replace the main website logo, partner brands, and client logos without changing their current ordering or layout." />{logos.length === 0 ? <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-sm text-zinc-600">No migrated logos are available yet. Run the seed migration after configuring Supabase.</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{logos.map((logo) => <article key={logo.id} className="rounded-2xl border border-black/5 bg-white p-4"><div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-[#f5f7f3] p-5"><img src={logo.image?.public_url} alt={`${logo.name} logo`} className="max-h-full w-full object-contain" /></div><h2 className="font-bold text-[#111827]">{logo.name}</h2><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#4a7b1d]">{logo.logo_type} logo</p><AssetUploadForm assetId={logo.storage_asset_id} assetType="logo" /></article>)}</div>}</div>;
}
