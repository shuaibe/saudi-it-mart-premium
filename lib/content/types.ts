export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type SiteSettings = {
  id: boolean;
  hero_eyebrow: string;
  hero_heading: string;
  hero_description: string;
  hero_features: string[];
  hero_stat_badges: string[];
  services_eyebrow: string;
  services_heading: string;
  about_eyebrow: string;
  about_heading: string;
  about_description: string;
  about_expanded_description: string;
  about_stats: Array<{ value: string; label: string }>;
  brands_eyebrow: string;
  brands_heading: string;
  projects_eyebrow: string;
  projects_heading: string;
  clients_eyebrow: string;
  clients_heading: string;
  location_eyebrow: string;
  location_heading: string;
  location_description: string;
  cta_heading: string;
  cta_description: string;
  footer_description: string;
  seo_title: string;
  seo_description: string;
  hero_image_asset_id: string | null;
  about_image_asset_id: string | null;
  updated_at?: string;
};

export type ContactSettings = {
  id: boolean;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  office_address: string;
  website_url: string;
  facebook_url: string;
  youtube_url: string;
  instagram_url: string;
  linkedin_url: string;
  additional_links: Array<{ label: string; url: string }>;
  updated_at?: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  asset_type: "hero" | "about" | "service" | "project" | "logo" | "other";
  storage_path: string;
  public_url: string;
  alt_text: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  detail: string;
  serial: string | null;
  tag: string | null;
  image_asset_id: string | null;
  display_order: number;
  is_visible: boolean;
  image?: MediaAsset | null;
};

export type ProjectRecord = {
  id: string;
  slug: string;
  name: string;
  location: string;
  scope: string;
  date_label: string;
  badge: string | null;
  detail: string;
  image_asset_id: string | null;
  display_order: number;
  is_visible: boolean;
  image?: MediaAsset | null;
};

export type LogoRecord = {
  id: string;
  name: string;
  logo_type: "main" | "partner" | "client";
  storage_asset_id: string;
  display_order: number;
  is_visible: boolean;
  image?: MediaAsset | null;
};
