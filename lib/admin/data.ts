import type { ContactSettings, LogoRecord, MediaAsset, ProjectRecord, ServiceRecord, SiteSettings } from "../content/types";
import { requireAdmin } from "./auth";

export async function getAdminSiteSettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle<SiteSettings>();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminContactSettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("contact_settings").select("*").eq("id", true).maybeSingle<ContactSettings>();
  if (error) throw new Error(error.message);
  return data;
}

export async function getAdminServices() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("services").select("*, image:media_assets(*)").order("display_order").returns<ServiceRecord[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminProjects() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").select("*, image:media_assets(*)").order("display_order").returns<ProjectRecord[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminMedia() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false }).returns<MediaAsset[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminLogos() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("logo_assets").select("*, image:media_assets(*)").order("logo_type").order("display_order").returns<LogoRecord[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}
