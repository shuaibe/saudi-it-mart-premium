"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminEmail } from "../supabase/env";
import { getSupabaseAdminClient, getSupabaseServerClient } from "../supabase/server";
import { validateImageFile } from "../media/image-validation";

export type ActionResult = { ok: boolean; message: string };

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function stats(value: FormDataEntryValue | null) {
  return lines(value).map((item) => {
    const [statValue, ...labelParts] = item.split("|");
    return { value: statValue.trim(), label: labelParts.join("|").trim() };
  }).filter((item) => item.value && item.label);
}

async function requireActionAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== getAdminEmail()) {
    throw new Error("Unauthorized admin action.");
  }

  return getSupabaseAdminClient();
}

export async function loginAdmin(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Enter your owner email and password." };
  }

  if (email !== getAdminEmail()) {
    return { ok: false, message: "This email is not authorized for the admin panel." };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: "The email or password is incorrect." };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateSiteSettings(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const payload = {
    hero_eyebrow: String(formData.get("hero_eyebrow") ?? ""),
    hero_heading: String(formData.get("hero_heading") ?? ""),
    hero_description: String(formData.get("hero_description") ?? ""),
    hero_features: lines(formData.get("hero_features")),
    hero_stat_badges: lines(formData.get("hero_stat_badges")),
    services_eyebrow: String(formData.get("services_eyebrow") ?? ""),
    services_heading: String(formData.get("services_heading") ?? ""),
    about_eyebrow: String(formData.get("about_eyebrow") ?? ""),
    about_heading: String(formData.get("about_heading") ?? ""),
    about_description: String(formData.get("about_description") ?? ""),
    about_expanded_description: String(formData.get("about_expanded_description") ?? ""),
    brands_eyebrow: String(formData.get("brands_eyebrow") ?? ""),
    about_stats: stats(formData.get("about_stats")),
    brands_heading: String(formData.get("brands_heading") ?? ""),
    projects_eyebrow: String(formData.get("projects_eyebrow") ?? ""),
    projects_heading: String(formData.get("projects_heading") ?? ""),
    clients_eyebrow: String(formData.get("clients_eyebrow") ?? ""),
    clients_heading: String(formData.get("clients_heading") ?? ""),
    location_eyebrow: String(formData.get("location_eyebrow") ?? ""),
    location_heading: String(formData.get("location_heading") ?? ""),
    location_description: String(formData.get("location_description") ?? ""),
    cta_heading: String(formData.get("cta_heading") ?? ""),
    cta_description: String(formData.get("cta_description") ?? ""),
    footer_description: String(formData.get("footer_description") ?? ""),
    seo_title: String(formData.get("seo_title") ?? ""),
    seo_description: String(formData.get("seo_description") ?? ""),
  };
  const { error } = await supabase.from("site_settings").upsert({ id: true, ...payload });

  if (error) return { ok: false, message: error.message };
  revalidateTag("public-site", "max");
  revalidatePath("/");
  return { ok: true, message: "Website content saved." };
}

export async function updateContactSettings(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const payload = {
    whatsapp_number: String(formData.get("whatsapp_number") ?? ""),
    phone_number: String(formData.get("phone_number") ?? ""),
    email: String(formData.get("email") ?? ""),
    office_address: String(formData.get("office_address") ?? ""),
    website_url: String(formData.get("website_url") ?? ""),
    facebook_url: String(formData.get("facebook_url") ?? ""),
    youtube_url: String(formData.get("youtube_url") ?? ""),
    instagram_url: String(formData.get("instagram_url") ?? ""),
    linkedin_url: String(formData.get("linkedin_url") ?? ""),
  };
  const { error } = await supabase.from("contact_settings").upsert({ id: true, ...payload });

  if (error) return { ok: false, message: error.message };
  revalidateTag("public-site", "max");
  revalidatePath("/");
  return { ok: true, message: "Contact and social links saved." };
}

export async function updateService(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("services").update({
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? ""),
    detail: String(formData.get("detail") ?? ""),
    serial: String(formData.get("serial") ?? "") || null,
    tag: String(formData.get("tag") ?? "") || null,
    display_order: Number(formData.get("display_order") ?? 0),
    is_visible: formData.get("is_visible") === "on",
  }).eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidateTag("public-site", "max");
  revalidatePath("/");
  revalidatePath("/admin/services");
  return { ok: true, message: "Service saved." };
}

export async function updateProject(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("projects").update({
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    scope: String(formData.get("scope") ?? ""),
    date_label: String(formData.get("date_label") ?? ""),
    badge: String(formData.get("badge") ?? "") || null,
    detail: String(formData.get("detail") ?? ""),
    display_order: Number(formData.get("display_order") ?? 0),
    is_visible: formData.get("is_visible") === "on",
  }).eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidateTag("public-site", "max");
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { ok: true, message: "Project saved." };
}

export async function replaceMediaAsset(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const file = formData.get("file");
  const replaceAssetId = String(formData.get("replace_asset_id") ?? "");
  const assetType = String(formData.get("asset_type") ?? "other");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose an image before saving." };
  }

  try {
    const { bytes, width, height } = await validateImageFile(file);
    const folder = assetType === "logo" ? "logos/other" : `${assetType}s`;
    const storagePath = `${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await supabase.storage.from("website-media").upload(storagePath, bytes, { contentType: file.type, upsert: false });
    if (upload.error) return { ok: false, message: upload.error.message };

    const publicUrl = supabase.storage.from("website-media").getPublicUrl(storagePath).data.publicUrl;
    const { data: asset, error: assetError } = await supabase.from("media_assets").insert({
      name: file.name,
      asset_type: assetType,
      storage_path: storagePath,
      public_url: publicUrl,
      alt_text: file.name.replace(/\.[^/.]+$/, ""),
      mime_type: file.type,
      file_size: file.size,
      width,
      height,
    }).select("id").single<{ id: string }>();
    if (assetError || !asset) return { ok: false, message: assetError?.message ?? "Could not save the image record." };

    if (replaceAssetId) {
      await Promise.all([
        supabase.from("site_settings").update({ hero_image_asset_id: asset.id }).eq("hero_image_asset_id", replaceAssetId),
        supabase.from("site_settings").update({ about_image_asset_id: asset.id }).eq("about_image_asset_id", replaceAssetId),
        supabase.from("services").update({ image_asset_id: asset.id }).eq("image_asset_id", replaceAssetId),
        supabase.from("projects").update({ image_asset_id: asset.id }).eq("image_asset_id", replaceAssetId),
        supabase.from("logo_assets").update({ storage_asset_id: asset.id }).eq("storage_asset_id", replaceAssetId),
      ]);
    }

    revalidateTag("public-site", "max");
    revalidatePath("/");
    revalidatePath("/admin/media");
    revalidatePath("/admin/logos");
    return { ok: true, message: "Image replacement saved. The original asset was kept." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Image validation failed." };
  }
}
