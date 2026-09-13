"use client";

import { useActionState } from "react";
import { updateService, type ActionResult } from "../../../lib/admin/actions";
import type { ServiceRecord } from "../../../lib/content/types";
import { ActionMessage } from "../components/action-message";
import { SubmitButton } from "../components/submit-button";

const initialState: ActionResult | null = null;
const inputClass = "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#83c94d]";

export function ServiceForm({ service }: { service: ServiceRecord }) {
  const [state, formAction] = useActionState(updateService, initialState);
  return <form action={formAction} className="space-y-4 rounded-2xl border border-black/5 bg-white p-5">
    <input type="hidden" name="id" value={service.id} />
    <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-[#111827]">{service.title}</h2><p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#4a7b1d]">{service.category}</p></div>{service.image?.public_url ? <img src={service.image.public_url} alt="" className="h-16 w-24 rounded-lg object-cover" /> : null}</div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold">Name</span><input name="title" defaultValue={service.title} className={inputClass} /></label>
    <div className="grid gap-4 sm:grid-cols-3"><label className="block"><span className="mb-1.5 block text-sm font-semibold">Category</span><input name="category" defaultValue={service.category} className={inputClass} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Serial</span><input name="serial" defaultValue={service.serial ?? ""} className={inputClass} /></label><label className="block"><span className="mb-1.5 block text-sm font-semibold">Badge</span><input name="tag" defaultValue={service.tag ?? ""} className={inputClass} /></label></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold">Short description</span><textarea name="description" defaultValue={service.description} rows={3} className={inputClass} /></label>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold">Detailed description</span><textarea name="detail" defaultValue={service.detail} rows={5} className={inputClass} /></label>
    <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_visible" defaultChecked={service.is_visible} /> Visible on website</label><label className="flex items-center gap-2 text-sm">Order<input name="display_order" type="number" defaultValue={service.display_order} className="w-20 rounded-lg border border-black/10 px-2 py-1.5" /></label></div>
    <ActionMessage result={state} reset={() => undefined} /><SubmitButton label="Save service" />
  </form>;
}
