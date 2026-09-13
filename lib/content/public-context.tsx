"use client";

import { createContext, useContext } from "react";

export type PublicContent = {
  site: {
    hero_eyebrow?: string;
    hero_heading?: string;
    hero_description?: string;
    hero_features?: string[];
    hero_stat_badges?: string[];
    services_eyebrow?: string;
    services_heading?: string;
    about_eyebrow?: string;
    about_heading?: string;
    about_description?: string;
    about_expanded_description?: string;
    about_stats?: Array<{ value: string; label: string }>;
    brands_eyebrow?: string;
    brands_heading?: string;
    projects_eyebrow?: string;
    projects_heading?: string;
    clients_eyebrow?: string;
    clients_heading?: string;
    location_eyebrow?: string;
    location_heading?: string;
    location_description?: string;
    cta_heading?: string;
    cta_description?: string;
    footer_description?: string;
  };
  contact: {
    whatsapp_number?: string;
    phone_number?: string;
    email?: string;
    office_address?: string;
    website_url?: string;
    facebook_url?: string;
    youtube_url?: string;
    instagram_url?: string;
    linkedin_url?: string;
  };
  heroImage?: string;
  aboutImage?: string;
  mainLogo?: string;
  services?: Array<Record<string, unknown>>;
  projects?: Array<Record<string, unknown>>;
  partnerBrands?: Array<{ name: string; image: string }>;
  clientLogos?: Array<{ name: string; image: string }>;
};

export const PublicContentContext = createContext<PublicContent | null>(null);

export function usePublicContent() {
  return useContext(PublicContentContext);
}
