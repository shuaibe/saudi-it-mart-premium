import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { getSupabaseEnv, getSupabaseServiceRoleKey } from "../lib/supabase/env";

const root = process.cwd();
loadEnvConfig(root);
const { url } = getSupabaseEnv();
const serviceRoleKey = getSupabaseServiceRoleKey();
const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: {
    // Seed requests must remain on the server-only service-role path.
    headers: { Authorization: `Bearer ${serviceRoleKey}` },
  },
});
const bucket = "website-media";

async function verifySeedConnection() {
  console.log("[seed] server-side secret key: present");
  console.log("[seed] client path: direct Supabase server client");
  const { error } = await supabase.from("media_assets").select("id").limit(1);
  if (error) {
    const diagnostic = {
      code: error.code || "none",
      details: error.details || "none",
      hint: error.hint || "none",
      message: error.message || "none",
    };
    throw new Error(`Seed database connection failed: ${JSON.stringify(diagnostic)}`);
  }
  console.log("[seed] database connection: succeeded");
}

type Asset = { id: string; public_url: string };
const assets = new Map<string, Asset>();

const serviceSeed = [
  ["structured-cabling", "Structured Cabling", "Cabling", "CAT6 / CAT6A / Rack / Patch Panel / Testing", "Structured cabling design and installation for commercial buildings, office campuses, and data centers with clean routing, testing, labeling, and future-ready capacity planning.", "01", "Most Requested", "services/structured-cabling.jpg"],
  ["fiber-optic", "Fiber Optic", "Fiber", "Installation / Splicing / OTDR Testing", "Fiber optic deployment including backbone cabling, splicing, testing, troubleshooting, and performance verification using OTDR and link certification tools.", "02", null, "services/fiber-optic.jpg"],
  ["cctv-surveillance", "CCTV & Surveillance", "CCTV", "IP Camera / NVR / DVR Configuration", "Integrated CCTV systems for retail, corporate, industrial, and public-facing sites with remote monitoring, retention planning, and camera health checks.", "03", null, "services/cctv-surveillance.jpg"],
  ["network-wifi", "Network & Wi-Fi", "Network", "Router / Switch / Wi-Fi AP / Network Infrastructure", "Reliable enterprise networking that includes router and switch setup, Wi-Fi deployment, segmentation, redundancy, and performance tuning for high-density spaces.", "04", null, "services/network-wifi.jpg"],
  ["access-control", "Access Control", "Access Control", "Door Access / Biometric / Controller / Reader", "Access solutions for secure entry points using RFID, biometric, and smart controller systems designed for offices, residential compounds, and commercial sites.", "05", null, "services/access-control.jpg"],
  ["skilled-manpower", "Skilled Manpower", "Manpower Supply", "ELV / ICT / Telecom Teams / Project Based", "Project-based deployment of technical manpower for ELV, ICT, and telecom execution, with trained teams ready for installation, testing, and commissioning support.", "06", "Verified Team", "services/skilled-manpower.jpg"],
  ["ups-systems", "UPS Systems", "Power Supply", "Online UPS / Backup Power / Critical Load Protection", "Online UPS systems that protect critical loads from outages, voltage disturbances, and power interruptions while supporting dependable infrastructure operation.", null, null, "services/data-center-riyadh.jpg"],
  ["dc-power-systems", "DC Power Systems", "Power Supply", "DC Power / Rectifier / Battery Backup Solutions", "DC power systems with rectifiers and battery backup solutions for telecom, networking, and low-current infrastructure that requires stable continuous power.", null, null, "services/network-wifi.jpg"],
  ["power-distribution", "Power Distribution", "Power Supply", "Distribution Boards / PDU / Electrical Infrastructure", "Power distribution planning and installation covering distribution boards, PDUs, rack power, and organized electrical infrastructure for efficient service delivery.", null, null, "services/structured-cabling.jpg"],
  ["battery-backup", "Battery Backup", "Power Supply", "Battery Banks / Backup Systems / Power Continuity", "Battery banks and backup systems designed to maintain power continuity, extend runtime, and support critical equipment during planned or unexpected interruptions.", null, null, "services/fiber-optic.jpg"],
  ["power-protection", "Power Protection", "Power Supply", "Surge Protection / Voltage Regulation / Power Safety", "Power protection solutions using surge protection and voltage regulation to reduce electrical risk and improve the safety and reliability of connected systems.", null, null, "services/cctv-surveillance.jpg"],
  ["backup-solutions", "Backup Solutions", "Power Supply", "Reliable Backup Power / Emergency Power / Business Continuity", "Reliable emergency and backup power solutions that help businesses maintain essential operations and continuity across critical ELV and ICT environments.", null, null, "services/access-control.jpg"],
] as const;

const projectSeed = [
  ["office-building", "Office Building", "Olaya, Riyadh", "CAT6 / IP Network Setup", "Mar 2025", "Recently Completed", "Integrated structured cabling and IP networking for a multi-floor office environment, including rack layout, testing, and final handover support.", "projects/office-building-olaya.jpg"],
  ["commercial-tower", "Commercial Tower", "KAFD, Riyadh", "CAT6A / 96 Ports / 16 Racks", "Jan 2025", null, "Full cabling deployment for a commercial tower with high-density rack distribution, evidence-based testing, and support for phased expansion.", "projects/commercial-tower-kafd.jpg"],
  ["data-center", "Data Center", "Riyadh", "Fiber Splicing / OTDR Testing", "Dec 2024", null, "Data center fiber backbone installation and OTDR validation to improve transmission integrity and enable future expansion capacity.", "projects/data-center-riyadh.jpg"],
  ["corporate-office", "Corporate Office", "Al Malaz, Riyadh", "Access Control / 115 Doors", "Nov 2024", null, "Secure access implementation across 115 doors for a corporate office with integrated controllers, credential management, and monitoring support.", "projects/corporate-office-almalaz.jpg"],
  ["hotel-project", "Hotel Project", "Riyadh", "Wi-Fi / AP / Network Setup", "Nov 2024", null, "High-coverage Wi-Fi and AP setup for guest and staff connectivity, including network design, switch configuration, and field optimization.", "projects/hotel-project-riyadh.jpg"],
  ["retail-store", "Retail Store", "Riyadh", "CCTV / Access Control", "Sep 2024", null, "Retail security upgrade combining CCTV coverage and access control for staff and customer areas with a consistent, easy to manage installation.", "projects/retail-store-riyadh.jpg"],
] as const;

const partnerLogos = ["hikvision", "dahua", "ubiquiti", "tp-link", "cisco", "mikrotik", "ruijie", "h3c", "zkteco", "hid", "commscope", "legrand"];
const clientLogos = ["aramco", "neom", "roshn", "saudia", "stc", "riyadh-season", "sabic"];

function mimeFor(path: string) {
  const extension = extname(path).toLowerCase();
  return extension === ".png" ? "image/png" : extension === ".svg" ? "image/svg+xml" : "image/jpeg";
}

async function uploadAsset(relativePath: string, assetType: "hero" | "about" | "service" | "project" | "logo", folder: string) {
  const existing = assets.get(relativePath);
  if (existing) return existing;
  const localPath = join(root, "public", "images", relativePath);
  const bytes = await readFile(localPath);
  const storagePath = `initial/${folder}/${relativePath.split("/").at(-1)}`;
  const mimeType = mimeFor(relativePath);
  const upload = await supabase.storage.from(bucket).upload(storagePath, bytes, { contentType: mimeType, upsert: true });
  if (upload.error) throw new Error(`Could not upload ${relativePath}: ${upload.error.message}`);
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
  const { data, error } = await supabase.from("media_assets").upsert({ name: relativePath.split("/").at(-1), asset_type: assetType, storage_path: storagePath, public_url: publicUrl, alt_text: relativePath.split("/").at(-1)?.replace(/\.[^/.]+$/, "") ?? "", mime_type: mimeType, file_size: bytes.length }).select("id, public_url").single<Asset>();
  if (error || !data) throw new Error(`Could not save ${relativePath}: ${error?.message ?? "unknown error"}`);
  assets.set(relativePath, data);
  return data;
}

async function main() {
  await verifySeedConnection();
  const hero = await uploadAsset("hero/hero-main.jpg", "hero", "hero");
  const about = await uploadAsset("about/about-main.png", "about", "about");

  const serviceRows = [];
  for (const [slug, title, category, description, detail, serial, tag, image] of serviceSeed) {
    const asset = await uploadAsset(image, "service", "services");
    serviceRows.push({ slug, title, category, description, detail, serial, tag, image_asset_id: asset.id, display_order: serviceRows.length, is_visible: true });
  }
  const projectRows = [];
  for (const [slug, name, location, scope, date_label, badge, detail, image] of projectSeed) {
    const asset = await uploadAsset(image, "project", "projects");
    projectRows.push({ slug, name, location, scope, date_label, badge, detail, image_asset_id: asset.id, display_order: projectRows.length, is_visible: true });
  }

  const logoRows = [];
  const mainLogo = await uploadAsset("logo/site-logo.svg", "logo", "logos/main");
  logoRows.push({ name: "Saudi IT Mart", logo_type: "main", storage_asset_id: mainLogo.id, display_order: 0, is_visible: true });
  for (const [index, name] of partnerLogos.entries()) {
    const asset = await uploadAsset(`brands/${name}.png`, "logo", "logos/partners");
    logoRows.push({ name: name === "tp-link" ? "TP-Link" : name[0].toUpperCase() + name.slice(1), logo_type: "partner", storage_asset_id: asset.id, display_order: index, is_visible: true });
  }
  for (const [index, name] of clientLogos.entries()) {
    const asset = await uploadAsset(`clients/${name}.png`, "logo", "logos/clients");
    logoRows.push({ name: name === "stc" ? "stc" : name.toUpperCase(), logo_type: "client", storage_asset_id: asset.id, display_order: index, is_visible: true });
  }

  const { error: siteError } = await supabase.from("site_settings").upsert({
    id: true,
    hero_eyebrow: "Trusted ELV & ICT partner in Saudi Arabia",
    hero_heading: "Complete ELV & ICT Project Execution",
    hero_description: "Saudi IT Mart provides project-based ELV, ICT and low-current installation solutions for contractors, businesses and construction projects across Riyadh and Saudi Arabia.",
    hero_features: ["Skilled Teams", "Reliable Execution", "On-Time Delivery"],
    hero_stat_badges: ["7+ Years Experience", "50+ Projects", "100+ Skilled Manpower", "100% Client Satisfaction"],
    services_eyebrow: "Our Services",
    services_heading: "Complete ELV, ICT and Low-Current Solutions",
    about_eyebrow: "About Saudi IT Mart",
    about_heading: "Good infrastructure should feel invisible.",
    about_description: "Saudi IT Mart provides project-based ELV, ICT and low-current installation solutions for contractors, businesses and construction projects across Riyadh and Saudi Arabia. The company also supplies skilled manpower and can mobilize technical teams to execute projects independently.",
    about_expanded_description: "We support contractors, developers, and facility owners with trusted execution, quality controls, and responsive project delivery from planning through commissioning.",
    about_stats: [{ value: "07+", label: "Years Experience" }, { value: "50+", label: "Projects Completed" }, { value: "100+", label: "Skilled Manpower" }, { value: "100%", label: "Client Satisfaction" }],
    brands_eyebrow: "Our Partner Brands",
    brands_heading: "We use trusted global brands for reliable and professional solutions.",
    projects_eyebrow: "Completed Projects",
    projects_heading: "Real Projects. Real Results.",
    clients_eyebrow: "Our Clients & Partners",
    clients_heading: "Trusted by leading contractors, businesses and organizations across Saudi Arabia.",
    location_eyebrow: "Shop / Office Location",
    location_heading: "Visit our Riyadh office or connect for onsite project support.",
    location_description: "Serving contractors, developers, and IT projects throughout Riyadh and the Kingdom.",
    cta_heading: "Have a New Project?",
    cta_description: "Send us your project details or manpower requirements. Our team will get back to you shortly.",
    footer_description: "Project-based ELV, ICT and low-current solutions across Saudi Arabia.",
    seo_title: "Saudi IT Mart — ELV & ICT Solutions in Saudi Arabia",
    seo_description: "Saudi IT Mart provides ELV, ICT and low-current installation solutions, project execution and technical manpower across Riyadh and Saudi Arabia.",
    hero_image_asset_id: hero.id,
    about_image_asset_id: about.id,
  });
  if (siteError) throw new Error(siteError.message);
  const { error: contactError } = await supabase.from("contact_settings").upsert({ id: true, whatsapp_number: "966501841918", phone_number: "+966 50 184 1918", email: "info@sauditmart.com", office_address: "Riyadh, Saudi Arabia", website_url: "http://www.sauditmart.com", facebook_url: "https://www.facebook.com", youtube_url: "https://www.youtube.com", instagram_url: "", linkedin_url: "https://www.linkedin.com", additional_links: [] });
  if (contactError) throw new Error(contactError.message);
  const { error: servicesError } = await supabase.from("services").upsert(serviceRows, { onConflict: "slug" });
  if (servicesError) throw new Error(servicesError.message);
  const { error: projectsError } = await supabase.from("projects").upsert(projectRows, { onConflict: "slug" });
  if (projectsError) throw new Error(projectsError.message);
  const { error: logosError } = await supabase.from("logo_assets").upsert(logoRows, { onConflict: "logo_type,name" });
  if (logosError) throw new Error(logosError.message);
  console.log(`Seeded ${serviceRows.length} services, ${projectRows.length} projects, ${logoRows.length} logos, and ${assets.size} media assets.`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
