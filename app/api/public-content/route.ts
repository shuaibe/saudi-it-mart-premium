import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../lib/supabase/env";
import { getSupabaseAdminClient } from "../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ configured: false }, { status: 503 });

  const supabase = getSupabaseAdminClient();
  const [siteResult, contactResult, servicesResult, projectsResult, logosResult] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("contact_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("services").select("*, image:media_assets(public_url)").eq("is_visible", true).order("display_order"),
    supabase.from("projects").select("*, image:media_assets(public_url)").eq("is_visible", true).order("display_order"),
    supabase.from("logo_assets").select("*, image:media_assets(public_url)").eq("is_visible", true).order("logo_type").order("display_order"),
  ]);
  const error = siteResult.error || contactResult.error || servicesResult.error || projectsResult.error || logosResult.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const site = siteResult.data;
  const logos = logosResult.data ?? [];
  const [heroAssetResult, aboutAssetResult] = await Promise.all([
    site?.hero_image_asset_id ? supabase.from("media_assets").select("public_url").eq("id", site.hero_image_asset_id).maybeSingle() : Promise.resolve({ data: null }),
    site?.about_image_asset_id ? supabase.from("media_assets").select("public_url").eq("id", site.about_image_asset_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  return NextResponse.json({
    configured: true,
    site,
    contact: contactResult.data,
    heroImage: heroAssetResult.data?.public_url,
    aboutImage: aboutAssetResult.data?.public_url,
    mainLogo: logos.find((logo) => logo.logo_type === "main")?.image?.public_url,
    services: (servicesResult.data ?? []).map(({ image, ...service }) => ({ ...service, image: image?.public_url ?? service.image })),
    projects: (projectsResult.data ?? []).map(({ image, ...project }) => ({ ...project, image: image?.public_url ?? project.image })),
    partnerBrands: logos.filter((logo) => logo.logo_type === "partner").map((logo) => ({ name: logo.name, image: logo.image?.public_url ?? "" })),
    clientLogos: logos.filter((logo) => logo.logo_type === "client").map((logo) => ({ name: logo.name, image: logo.image?.public_url ?? "" })),
  }, { headers: { "Cache-Control": "no-store" } });
}
