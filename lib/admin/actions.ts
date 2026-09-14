"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "./authorization";
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

  if (!user || !(await isAdminUser(supabase, user.id))) {
    throw new Error("Unauthorized admin action.");
  }

  return getSupabaseAdminClient();
}

export async function loginAdmin(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Enter your admin email and password." };
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { ok: false, message: "The email or password is incorrect." };
  }

  if (!(await isAdminUser(supabase, data.user.id))) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account is not authorized for the admin panel." };
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

    if (replaceAssetId) await removeUnusedAsset(supabase, replaceAssetId);

    revalidateTag("public-site", "max");
    revalidatePath("/");
    revalidatePath("/admin/media");
    revalidatePath("/admin/logos");
    return { ok: true, message: "Image replacement saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Image validation failed." };
  }
}

function slugify(value: string) {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "service";
}

async function uploadAdminImage(supabase: Awaited<ReturnType<typeof getSupabaseAdminClient>>, file: File, assetType: "service" | "logo") {
  const { bytes, width, height } = await validateImageFile(file);
  const storagePath = `${assetType}s/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const upload = await supabase.storage.from("website-media").upload(storagePath, bytes, { contentType: file.type, upsert: false });
  if (upload.error) throw new Error(upload.error.message);

  const publicUrl = supabase.storage.from("website-media").getPublicUrl(storagePath).data.publicUrl;
  const { data, error } = await supabase.from("media_assets").insert({
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
  if (error || !data) {
    await supabase.storage.from("website-media").remove([storagePath]);
    throw new Error(error?.message ?? "Could not save the image record.");
  }
  return data.id;
}

async function revalidateServices() {
  revalidateTag("public-site", "max");
  revalidatePath("/");
  revalidatePath("/admin/services");
}

async function revalidateLogos() {
  revalidateTag("public-site", "max");
  revalidatePath("/");
  revalidatePath("/admin/logos");
}

async function compactServiceOrder(supabase: Awaited<ReturnType<typeof getSupabaseAdminClient>>) {
  const { data, error } = await supabase.from("services").select("id").order("display_order").order("created_at");
  if (error) throw new Error(error.message);
  await Promise.all((data ?? []).map((service, index) => supabase.from("services").update({ display_order: index + 1 }).eq("id", service.id)));
}

async function compactLogoOrder(supabase: Awaited<ReturnType<typeof getSupabaseAdminClient>>, logoType: "main" | "partner" | "client") {
  const { data, error } = await supabase.from("logo_assets").select("id").eq("logo_type", logoType).order("display_order").order("name");
  if (error) throw new Error(error.message);
  await Promise.all((data ?? []).map((logo, index) => supabase.from("logo_assets").update({ display_order: index + 1 }).eq("id", logo.id)));
}

async function removeUnusedAsset(supabase: Awaited<ReturnType<typeof getSupabaseAdminClient>>, assetId: string | null) {
  if (!assetId) return;
  const [service, project, logo, settings] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }).eq("image_asset_id", assetId),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("image_asset_id", assetId),
    supabase.from("logo_assets").select("id", { count: "exact", head: true }).eq("storage_asset_id", assetId),
    supabase.from("site_settings").select("id", { count: "exact", head: true }).or(`hero_image_asset_id.eq.${assetId},about_image_asset_id.eq.${assetId}`),
  ]);
  if ([service, project, logo, settings].some((result) => result.error || (result.count ?? 0) > 0)) return;
  const { data: asset } = await supabase.from("media_assets").select("storage_path").eq("id", assetId).maybeSingle<{ storage_path: string }>();
  if (!asset) return;
  await supabase.storage.from("website-media").remove([asset.storage_path]);
  await supabase.from("media_assets").delete().eq("id", assetId);
}

export async function createService(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  const file = formData.get("file");
  if (!title || !category || !description || !detail) return { ok: false, message: "Title, category, short description, and detailed description are required." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose an image for the new category." };
  try {
    const imageAssetId = await uploadAdminImage(supabase, file, "service");
    const { data: last } = await supabase.from("services").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle<{ display_order: number }>();
    const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;
    const { error } = await supabase.from("services").insert({ slug, title, category, description, detail, serial: null, tag: String(formData.get("tag") ?? "").trim() || null, image_asset_id: imageAssetId, display_order: (last?.display_order ?? 0) + 1, is_visible: formData.get("is_visible") === "on" });
    if (error) { await removeUnusedAsset(supabase, imageAssetId); return { ok: false, message: error.message }; }
    await compactServiceOrder(supabase);
    await revalidateServices();
    return { ok: true, message: "Category added to the end of the service list." };
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Could not add the category." }; }
}

export async function deleteService(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const { data: service, error: readError } = await supabase.from("services").select("image_asset_id").eq("id", id).maybeSingle<{ image_asset_id: string | null }>();
  if (readError || !service) return { ok: false, message: "Service not found." };
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  await compactServiceOrder(supabase);
  await removeUnusedAsset(supabase, service.image_asset_id);
  await revalidateServices();
  return { ok: true, message: "Service deleted and numbering updated." };
}

export async function moveService(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const { data, error } = await supabase.from("services").select("id").order("display_order").order("created_at");
  if (error) return { ok: false, message: error.message };
  const index = (data ?? []).findIndex((service) => service.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= (data ?? []).length) return { ok: false, message: "This category cannot move further." };
  const ordered = [...(data ?? [])]; [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  const results = await Promise.all(ordered.map((service, position) => supabase.from("services").update({ display_order: position + 1 }).eq("id", service.id)));
  const failed = results.find((result) => result.error)?.error;
  if (failed) return { ok: false, message: failed.message };
  await revalidateServices();
  return { ok: true, message: "Service order saved." };
}

export async function createLogo(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const logoType = String(formData.get("logo_type") ?? "") as "main" | "partner" | "client";
  const file = formData.get("file");
  if (!name || !["main", "partner", "client"].includes(logoType)) return { ok: false, message: "Company name and logo group are required." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a logo image." };
  try {
    const imageAssetId = await uploadAdminImage(supabase, file, "logo");
    const { data: last } = await supabase.from("logo_assets").select("display_order").eq("logo_type", logoType).order("display_order", { ascending: false }).limit(1).maybeSingle<{ display_order: number }>();
    const { error } = await supabase.from("logo_assets").insert({ name, logo_type: logoType, storage_asset_id: imageAssetId, display_order: (last?.display_order ?? 0) + 1, is_visible: formData.get("is_visible") === "on" });
    if (error) { await removeUnusedAsset(supabase, imageAssetId); return { ok: false, message: error.message }; }
    await compactLogoOrder(supabase, logoType);
    await revalidateLogos();
    return { ok: true, message: "Logo added." };
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Could not add the logo." }; }
}

export async function updateLogo(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { ok: false, message: "Company name is required." };
  const { error } = await supabase.from("logo_assets").update({ name, is_visible: formData.get("is_visible") === "on" }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  await revalidateLogos();
  return { ok: true, message: "Logo details saved." };
}

export async function deleteLogo(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const { data: logo, error: readError } = await supabase.from("logo_assets").select("storage_asset_id, logo_type").eq("id", id).maybeSingle<{ storage_asset_id: string; logo_type: "main" | "partner" | "client" }>();
  if (readError || !logo) return { ok: false, message: "Logo not found." };
  const { error } = await supabase.from("logo_assets").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  await compactLogoOrder(supabase, logo.logo_type);
  await removeUnusedAsset(supabase, logo.storage_asset_id);
  await revalidateLogos();
  return { ok: true, message: "Logo deleted." };
}

export async function moveLogo(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await requireActionAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const { data: current, error: currentError } = await supabase.from("logo_assets").select("logo_type").eq("id", id).maybeSingle<{ logo_type: "main" | "partner" | "client" }>();
  if (currentError || !current) return { ok: false, message: "Logo not found." };
  const { data, error } = await supabase.from("logo_assets").select("id").eq("logo_type", current.logo_type).order("display_order").order("name");
  if (error) return { ok: false, message: error.message };
  const index = (data ?? []).findIndex((logo) => logo.id === id); const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= (data ?? []).length) return { ok: false, message: "This logo cannot move further." };
  const ordered = [...(data ?? [])]; [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  const results = await Promise.all(ordered.map((logo, position) => supabase.from("logo_assets").update({ display_order: position + 1 }).eq("id", logo.id)));
  const failed = results.find((result) => result.error)?.error;
  if (failed) return { ok: false, message: failed.message };
  await revalidateLogos();
  return { ok: true, message: "Logo order saved." };
}
