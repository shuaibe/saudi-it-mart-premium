"use client";

import { useActionState } from "react";
import { updateContactSettings, type ActionResult } from "../../../lib/admin/actions";
import type { ContactSettings } from "../../../lib/content/types";
import { ActionMessage } from "../components/action-message";
import { SubmitButton } from "../components/submit-button";

const initialState: ActionResult | null = null;
const fields = [["whatsapp_number", "WhatsApp number"], ["phone_number", "Phone number"], ["email", "Email"], ["office_address", "Office address"], ["website_url", "Website URL"], ["facebook_url", "Facebook URL"], ["youtube_url", "YouTube URL"], ["instagram_url", "Instagram URL"], ["linkedin_url", "LinkedIn URL"]] as const;

export function ContactForm({ settings }: { settings: ContactSettings | null }) {
  const [state, formAction] = useActionState(updateContactSettings, initialState);
  return <form action={formAction} className="space-y-6 rounded-2xl border border-black/5 bg-white p-5">
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map(([name, label]) => <label key={name} className="block"><span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span><input name={name} defaultValue={settings?.[name] ?? ""} className="h-11 w-full rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-[#83c94d]" /></label>)}
    </div>
    <ActionMessage result={state} reset={() => undefined} />
    <SubmitButton />
  </form>;
}
