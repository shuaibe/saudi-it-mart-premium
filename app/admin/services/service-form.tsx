"use client";

import { useActionState, useState } from "react";
import { createService, deleteService, moveService, updateService, type ActionResult } from "../../../lib/admin/actions";
import type { ServiceRecord } from "../../../lib/content/types";
import { ActionMessage } from "../components/action-message";
import { AssetUploadForm } from "../components/asset-upload-form";
import { SubmitButton } from "../components/submit-button";

const initialState: ActionResult | null = null;
const inputClass = "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#83c94d]";

function ImageField({ required = false }: { required?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">Image{required ? " (required)" : ""}</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={(event) => { const file = event.target.files?.[0]; if (!file) return setPreview(null); if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { event.currentTarget.value = ""; return setPreview(null); } setPreview(URL.createObjectURL(file)); }} className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e6f8c9] file:px-3 file:py-2 file:font-semibold" />{preview ? <img src={preview} alt="Selected image preview" className="mt-3 h-32 w-full rounded-xl object-cover" /> : null}<span className="mt-1 block text-xs text-zinc-500">JPEG, PNG, or WebP, up to 5 MB.</span></label>;
}

export function AddServiceForm() {
  const [state, formAction] = useActionState(createService, initialState);
  return <details className="mb-6 rounded-2xl border border-[#83c94d]/40 bg-white p-5"><summary className="cursor-pointer font-bold text-[#315317]">Add Category</summary><form action={formAction} className="mt-5 grid gap-4 md:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-semibold">Title</span><input name="title" required className={inputClass} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Category label</span><input name="category" required className={inputClass} /></label><label className="block md:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Short description</span><textarea name="description" required rows={3} className={inputClass} /></label><label className="block md:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Detailed description</span><textarea name="detail" required rows={5} className={inputClass} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Badge (optional)</span><input name="tag" className={inputClass} /></label><label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" name="is_visible" defaultChecked /> Visible on website</label><div className="md:col-span-2"><ImageField required /></div><div className="md:col-span-2"><ActionMessage result={state} reset={() => undefined} /><SubmitButton label="Add category" /></div></form></details>;
}

export function ServiceForm({ service, position, total }: { service: ServiceRecord; position: number; total: number }) {
  const [state, formAction] = useActionState(updateService, initialState);
  const [moveState, moveAction] = useActionState(moveService, initialState);
  const [deleteState, deleteAction] = useActionState(deleteService, initialState);

  return (
    <article className="space-y-4 rounded-2xl border border-black/5 bg-white p-5">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={service.id} />
        <input type="hidden" name="display_order" value={service.display_order} />
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#4a7b1d]">{String(position).padStart(2, "0")}</p><h2 className="text-xl font-bold text-[#111827]">{service.title}</h2></div>{service.image?.public_url ? <img src={service.image.public_url} alt="" className="h-16 w-24 rounded-lg object-cover" /> : null}</div>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Name</span><input name="title" required defaultValue={service.title} className={inputClass} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-sm font-semibold">Category</span><input name="category" required defaultValue={service.category} className={inputClass} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Badge</span><input name="tag" defaultValue={service.tag ?? ""} className={inputClass} /></label></div>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Short description</span><textarea name="description" required defaultValue={service.description} rows={3} className={inputClass} /></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Detailed description</span><textarea name="detail" required defaultValue={service.detail} rows={5} className={inputClass} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_visible" defaultChecked={service.is_visible} /> Visible on website</label>
        <ActionMessage result={state} reset={() => undefined} /><SubmitButton label="Save service" />
      </form>
      {service.image_asset_id ? <AssetUploadForm assetId={service.image_asset_id} assetType="service" /> : null}
      <div className="flex flex-wrap gap-2 border-t border-black/5 pt-4">
        <form action={moveAction}><input type="hidden" name="id" value={service.id} /><input type="hidden" name="direction" value="up" /><button type="submit" disabled={position === 1} className="rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold disabled:opacity-40">Move Up</button></form>
        <form action={moveAction}><input type="hidden" name="id" value={service.id} /><input type="hidden" name="direction" value="down" /><button type="submit" disabled={position === total} className="rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold disabled:opacity-40">Move Down</button></form>
        <form action={deleteAction} onSubmit={(event) => { if (!window.confirm("Delete this service? This cannot be undone.")) event.preventDefault(); }}><input type="hidden" name="id" value={service.id} /><button type="submit" className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Delete</button></form>
      </div>
      <ActionMessage result={moveState ?? deleteState} reset={() => undefined} />
    </article>
  );
}