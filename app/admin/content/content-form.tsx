"use client";

import { useActionState } from "react";
import { updateSiteSettings, type ActionResult } from "../../../lib/admin/actions";
import type { SiteSettings } from "../../../lib/content/types";
import { ActionMessage } from "../components/action-message";
import { SubmitButton } from "../components/submit-button";

const initialState: ActionResult | null = null;

function Field({ label, name, value, multiline = false }: { label: string; name: string; value: string; multiline?: boolean }) {
  const className = "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#83c94d]";
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>{multiline ? <textarea name={name} defaultValue={value} rows={4} className={className} /> : <input name={name} defaultValue={value} className={className} />}</label>;
}

function LinesField({ label, name, value, hint }: { label: string; name: string; value: string; hint: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span><textarea name={name} defaultValue={value} rows={4} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#83c94d]" /><span className="mt-1 block text-xs text-zinc-500">{hint}</span></label>;
}

export function ContentForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction] = useActionState(updateSiteSettings, initialState);
  const value = (key: keyof SiteSettings) => typeof settings?.[key] === "string" ? settings[key] as string : "";

  const stringList = (key: "hero_features" | "hero_stat_badges") => settings?.[key]?.join("\n") ?? "";
  const statList = settings?.about_stats?.map((stat) => `${stat.value} | ${stat.label}`).join("\n") ?? "";
  return <form action={formAction} className="space-y-8">
    <div className="grid gap-5 rounded-2xl border border-black/5 bg-white p-5 md:grid-cols-2">
      <div className="md:col-span-2"><h2 className="text-lg font-bold text-[#111827]">Hero</h2></div>
      <Field label="Eyebrow" name="hero_eyebrow" value={value("hero_eyebrow")} />
      <Field label="Heading" name="hero_heading" value={value("hero_heading")} />
      <div className="md:col-span-2"><Field label="Description" name="hero_description" value={value("hero_description")} multiline /></div>
    </div>
    <div className="grid gap-5 rounded-2xl border border-black/5 bg-white p-5 md:grid-cols-2">
      <LinesField label="Feature labels" name="hero_features" value={stringList("hero_features")} hint="One label per line." />
      <LinesField label="Statistic badges" name="hero_stat_badges" value={stringList("hero_stat_badges")} hint="One badge per line." />
      <div className="md:col-span-2"><h2 className="text-lg font-bold text-[#111827]">About</h2></div>
      <Field label="Eyebrow" name="about_eyebrow" value={value("about_eyebrow")} />
      <Field label="Heading" name="about_heading" value={value("about_heading")} />
      <div className="md:col-span-2"><Field label="Description" name="about_description" value={value("about_description")} multiline /></div>
      <div className="md:col-span-2"><Field label="Expanded description" name="about_expanded_description" value={value("about_expanded_description")} multiline /></div>
    </div>
    <div className="grid gap-5 rounded-2xl border border-black/5 bg-white p-5 md:grid-cols-2">
      <div className="md:col-span-2"><LinesField label="About statistics" name="about_stats" value={statList} hint="One statistic per line, formatted as value | label." /></div>
      <div className="md:col-span-2"><h2 className="text-lg font-bold text-[#111827]">Sections and SEO</h2></div>
      <Field label="Services eyebrow" name="services_eyebrow" value={value("services_eyebrow")} />
      <Field label="Services heading" name="services_heading" value={value("services_heading")} />
      <Field label="Brands eyebrow" name="brands_eyebrow" value={value("brands_eyebrow")} />
      <Field label="Brands heading" name="brands_heading" value={value("brands_heading")} />
      <Field label="Projects eyebrow" name="projects_eyebrow" value={value("projects_eyebrow")} />
      <Field label="Projects heading" name="projects_heading" value={value("projects_heading")} />
      <Field label="Clients eyebrow" name="clients_eyebrow" value={value("clients_eyebrow")} />
      <Field label="Clients heading" name="clients_heading" value={value("clients_heading")} />
      <Field label="Location eyebrow" name="location_eyebrow" value={value("location_eyebrow")} />
      <Field label="Location heading" name="location_heading" value={value("location_heading")} />
      <div className="md:col-span-2"><Field label="Location description" name="location_description" value={value("location_description")} multiline /></div>
      <Field label="CTA heading" name="cta_heading" value={value("cta_heading")} />
      <Field label="CTA description" name="cta_description" value={value("cta_description")} multiline />
      <div className="md:col-span-2"><Field label="Footer description" name="footer_description" value={value("footer_description")} multiline /></div>
      <Field label="SEO title" name="seo_title" value={value("seo_title")} />
      <Field label="SEO description" name="seo_description" value={value("seo_description")} multiline />
    </div>
    <ActionMessage result={state} reset={() => undefined} />
    <SubmitButton />
  </form>;
}
