import { getAdminMedia } from "../../../lib/admin/data";
import { AssetUploadForm } from "../components/asset-upload-form";
import { PageHeading } from "../components/page-heading";

export default async function AdminMediaPage() {
  const assets = await getAdminMedia();
  return <div className="mx-auto max-w-6xl"><PageHeading eyebrow="Persistent website images" title="Media" description="Replace currently used images with validated JPEG, PNG, or WebP uploads. Original assets are kept during migration and replacement." />{assets.length === 0 ? <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-sm text-zinc-600">No migrated media assets are available yet. Run the seed migration after configuring Supabase.</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <article key={asset.id} className="rounded-2xl border border-black/5 bg-white p-4"><div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-[#f5f7f3] p-3"><img src={asset.public_url} alt={asset.alt_text} className="max-h-full w-full object-contain" /></div><h2 className="truncate font-bold text-[#111827]">{asset.name}</h2><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#4a7b1d]">{asset.asset_type} · {asset.width}×{asset.height}</p><AssetUploadForm assetId={asset.id} assetType={asset.asset_type} /></article>)}</div>}</div>;
}
