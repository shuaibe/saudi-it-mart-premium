"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type ThemeMode = "light" | "dark";

type Service = {
  title: string;
  category: string;
  description: string;
  serial: string;
  image: string;
  tag?: string;
  detail: string;
};

type Project = {
  name: string;
  location: string;
  scope: string;
  date: string;
  badge?: string;
  image: string;
  detail: string;
};

type ImageAsset = {
  name: string;
  image: string;
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Project Contracting", href: "#services" },
  { label: "Manpower Supply", href: "#services" },
  { label: "Completed Projects", href: "#completed-projects" },
  { label: "For Contractors", href: "#project-cta" },
  { label: "Contact Us", href: "#contact-us" },
];

const whatsappNumber = "966501841918";
const whatsappUrl = `https://wa.me/${whatsappNumber}`;

const serviceCategories = [
  "All",
  "Cabling",
  "Fiber",
  "CCTV",
  "Network",
  "Access Control",
  "Manpower Supply",
];

const services: Service[] = [
  {
    title: "Structured Cabling",
    category: "Cabling",
    description: "CAT6 / CAT6A / Rack / Patch Panel / Testing",
    serial: "01",
    image: "/images/services/structured-cabling.jpg",
    tag: "Most Requested",
    detail:
      "Structured cabling design and installation for commercial buildings, office campuses, and data centers with clean routing, testing, labeling, and future-ready capacity planning.",
  },
  {
    title: "Fiber Optic",
    category: "Fiber",
    description: "Installation / Splicing / OTDR Testing",
    serial: "02",
    image: "/images/services/fiber-optic.jpg",
    detail:
      "Fiber optic deployment including backbone cabling, splicing, testing, troubleshooting, and performance verification using OTDR and link certification tools.",
  },
  {
    title: "CCTV & Surveillance",
    category: "CCTV",
    description: "IP Camera / NVR / DVR Configuration",
    serial: "03",
    image: "/images/services/cctv-surveillance.jpg",
    detail:
      "Integrated CCTV systems for retail, corporate, industrial, and public-facing sites with remote monitoring, retention planning, and camera health checks.",
  },
  {
    title: "Network & Wi-Fi",
    category: "Network",
    description: "Router / Switch / Wi-Fi AP / Network Infrastructure",
    serial: "04",
    image: "/images/services/network-wifi.jpg",
    detail:
      "Reliable enterprise networking that includes router and switch setup, Wi-Fi deployment, segmentation, redundancy, and performance tuning for high-density spaces.",
  },
  {
    title: "Access Control",
    category: "Access Control",
    description: "Door Access / Biometric / Controller / Reader",
    serial: "05",
    image: "/images/services/access-control.jpg",
    detail:
      "Access solutions for secure entry points using RFID, biometric, and smart controller systems designed for offices, residential compounds, and commercial sites.",
  },
  {
    title: "Skilled Manpower",
    category: "Manpower Supply",
    description: "ELV / ICT / Telecom Teams / Project Based",
    serial: "06",
    image: "/images/services/skilled-manpower.jpg",
    tag: "Verified Team",
    detail:
      "Project-based deployment of technical manpower for ELV, ICT, and telecom execution, with trained teams ready for installation, testing, and commissioning support.",
  },
];

const statItems = [
  { value: "07+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "100+", label: "Skilled Manpower" },
  { value: "100%", label: "Client Satisfaction" },
];

const partnerBrands: ImageAsset[] = [
  { name: "Hikvision", image: "/images/brands/hikvision.png" },
  { name: "Dahua", image: "/images/brands/dahua.png" },
  { name: "Ubiquiti", image: "/images/brands/ubiquiti.png" },
  { name: "TP-Link", image: "/images/brands/tp-link.png" },
  { name: "Cisco", image: "/images/brands/cisco.png" },
  { name: "MikroTik", image: "/images/brands/mikrotik.png" },
  { name: "Ruijie", image: "/images/brands/ruijie.png" },
  { name: "H3C", image: "/images/brands/h3c.png" },
  { name: "ZKTeco", image: "/images/brands/zkteco.png" },
  { name: "HID", image: "/images/brands/hid.png" },
  { name: "CommScope", image: "/images/brands/commscope.png" },
  { name: "Legrand", image: "/images/brands/legrand.png" },
];

const projects: Project[] = [
  {
    name: "Office Building",
    location: "Olaya, Riyadh",
    scope: "CAT6 / IP Network Setup",
    date: "Mar 2025",
    badge: "Recently Completed",
    image: "/images/projects/office-building-olaya.jpg",
    detail:
      "Integrated structured cabling and IP networking for a multi-floor office environment, including rack layout, testing, and final handover support.",
  },
  {
    name: "Commercial Tower",
    location: "KAFD, Riyadh",
    scope: "CAT6A / 96 Ports / 16 Racks",
    date: "Jan 2025",
    image: "/images/projects/commercial-tower-kafd.jpg",
    detail:
      "Full cabling deployment for a commercial tower with high-density rack distribution, evidence-based testing, and support for phased expansion.",
  },
  {
    name: "Data Center",
    location: "Riyadh",
    scope: "Fiber Splicing / OTDR Testing",
    date: "Dec 2024",
    image: "/images/projects/data-center-riyadh.jpg",
    detail:
      "Data center fiber backbone installation and OTDR validation to improve transmission integrity and enable future expansion capacity.",
  },
  {
    name: "Corporate Office",
    location: "Al Malaz, Riyadh",
    scope: "Access Control / 115 Doors",
    date: "Nov 2024",
    image: "/images/projects/corporate-office-almalaz.jpg",
    detail:
      "Secure access implementation across 115 doors for a corporate office with integrated controllers, credential management, and monitoring support.",
  },
  {
    name: "Hotel Project",
    location: "Riyadh",
    scope: "Wi-Fi / AP / Network Setup",
    date: "Nov 2024",
    image: "/images/projects/hotel-project-riyadh.jpg",
    detail:
      "High-coverage Wi-Fi and AP setup for guest and staff connectivity, including network design, switch configuration, and field optimization.",
  },
  {
    name: "Retail Store",
    location: "Riyadh",
    scope: "CCTV / Access Control",
    date: "Sep 2024",
    image: "/images/projects/retail-store-riyadh.jpg",
    detail:
      "Retail security upgrade combining CCTV coverage and access control for staff and customer areas with a consistent, easy to manage installation." ,
  },
];

const clientLogos: ImageAsset[] = [
  { name: "Aramco", image: "/images/clients/aramco.png" },
  { name: "NEOM", image: "/images/clients/neom.png" },
  { name: "ROSHN", image: "/images/clients/roshn.png" },
  { name: "SAUDIA", image: "/images/clients/saudia.png" },
  { name: "stc", image: "/images/clients/stc.png" },
  { name: "Riyadh Season", image: "/images/clients/riyadh-season.png" },
  { name: "SABIC", image: "/images/clients/sabic.png" },
];

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  project: "",
  message: "",
};

function Header({ theme, onToggleTheme }: { theme: ThemeMode; onToggleTheme: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isDark = theme === "dark";

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = searchTerm.trim().toLowerCase();
    if (!value) {
      scrollToSection("services");
      return;
    }

    const relevant = services.some((service) =>
      `${service.title} ${service.description} ${service.category}`.toLowerCase().includes(value),
    );

    if (relevant) {
      scrollToSection("services");
      return;
    }

    const projectMatch = projects.some((project) =>
      `${project.name} ${project.location} ${project.scope}`.toLowerCase().includes(value),
    );

    if (projectMatch) {
      scrollToSection("completed-projects");
      return;
    }

    scrollToSection("services");
  };

  return (
    <header id="home" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
        <div className={[
          "mb-3 hidden items-center justify-between rounded-full border px-5 py-2 text-[11px] shadow-[0_8px_22px_rgba(17,24,39,0.04)] backdrop-blur-sm md:flex",
          isDark ? "border-white/10 bg-[#0f1a24]/80 text-slate-200" : "border-black/5 bg-white/80 text-zinc-600",
        ].join(" ")}>
          <div className="flex items-center gap-6">
            <span>Riyadh, Saudi Arabia</span>
            <span>+966 50 184 1918</span>
            <a href="mailto:info@sauditmart.com" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>
              info@sauditmart.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>
              LinkedIn
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>
              Facebook
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>
              YouTube
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>
              WhatsApp
            </a>
          </div>
        </div>

        <nav className={[
          "rounded-[28px] border px-4 py-3 shadow-[0_15px_45px_rgba(24,39,26,0.08)] backdrop-blur-sm md:px-6",
          isDark ? "border-white/10 bg-[#0f1a24]/80" : "border-black/5 bg-[#f7f7f4]/90",
        ].join(" ")}>
          <div className="flex items-center justify-between gap-3">
            <a href="#home" className="flex items-center gap-3" aria-label="Saudi IT Mart home">
              <Image src="/images/logo/site-logo.svg" alt="Saudi IT Mart logo" width={40} height={40} className="rounded-xl" />
              <div className={isDark ? "text-xl font-black tracking-tight text-white" : "text-xl font-black tracking-tight text-[#0f1720]"}>Saudi IT Mart</div>
            </a>

            <div className={[
              "hidden flex-1 items-center justify-center gap-7 text-sm font-medium xl:flex",
              isDark ? "text-slate-200" : "text-zinc-700",
            ].join(" ")}>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(item.href.replace("#", ""));
                  }}
                  className={isDark ? "transition hover:text-white" : "transition hover:text-[#0f1720]"}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              <form onSubmit={handleSearchSubmit} className="relative block w-[280px]">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search services, projects..."
                  className={[
                    "h-11 w-full rounded-full border px-4 pr-11 text-sm shadow-sm outline-none placeholder:text-zinc-400 focus:border-[#9adf5e]",
                    isDark ? "border-white/10 bg-[#142534] text-white" : "border-black/5 bg-white text-zinc-700",
                  ].join(" ")}
                />
                <button type="submit" aria-label="Search services and projects" className={isDark ? "absolute right-3 top-1/2 -translate-y-1/2 text-base text-slate-300" : "absolute right-3 top-1/2 -translate-y-1/2 text-base text-zinc-500"}>
                  ⌕
                </button>
              </form>
              <button type="button" onClick={onToggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className={[
                "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                isDark ? "border-white/10 bg-[#142534] text-slate-100 hover:bg-[#1b2f40]" : "border-black/10 bg-white text-zinc-800 hover:bg-zinc-50",
              ].join(" ")}><span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>{isDark ? "Light" : "Dark"}</button>
              <a
                href="#project-cta"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("project-cta");
                }}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0f1720] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1a242c]"
              >
                Request a Quote <span aria-hidden>→</span>
              </a>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <button type="button" onClick={onToggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className={[
                "inline-flex h-11 items-center rounded-full border px-3 text-sm font-semibold",
                isDark ? "border-white/10 bg-[#142534] text-slate-100" : "border-black/10 bg-white text-zinc-800",
              ].join(" ")}>{isDark ? "☀️ Light" : "🌙 Dark"}</button>
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-label="Toggle navigation menu"
                className={[
                  "inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold",
                  isDark ? "border-white/10 bg-[#142534] text-slate-100" : "border-black/10 bg-white text-zinc-800",
                ].join(" ")}
              >
                Menu
              </button>
            </div>
          </div>

          {mobileNavOpen ? (
            <div className={[
              "mt-4 rounded-[24px] border p-4 xl:hidden",
              isDark ? "border-white/10 bg-[#142534]" : "border-black/5 bg-white",
            ].join(" ")}>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(item.href.replace("#", ""));
                    }}
                    className={[
                      "rounded-full px-3 py-2 text-sm font-medium",
                      isDark ? "text-slate-200 hover:bg-[#1b2f40] hover:text-white" : "text-zinc-700 hover:bg-[#edf7d9] hover:text-[#0f1720]",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <form onSubmit={handleSearchSubmit} className="mt-4 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search services, projects..."
                  className={[
                    "h-11 w-full rounded-full border px-4 text-sm outline-none placeholder:text-zinc-400",
                    isDark ? "border-white/10 bg-[#101d28] text-white" : "border-black/5 bg-[#f7f7f4] text-zinc-700",
                  ].join(" ")}
                />
                <button type="submit" className={isDark ? "absolute right-3 top-1/2 -translate-y-1/2 text-base text-slate-300" : "absolute right-3 top-1/2 -translate-y-1/2 text-base text-zinc-500"}>
                  ⌕
                </button>
              </form>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

function Hero({ isDark }: { isDark: boolean }) {
  const scrollToCta = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("project-cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToServices = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-4 md:px-8">
        <div className={[
          "rounded-[36px] border p-6 shadow-[0_18px_40px_rgba(17,24,39,0.06)] md:p-8 lg:p-10",
          isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
        ].join(" ")}>
          <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <p className={isDark ? "mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a7d86d]" : "mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500"}>
                Trusted ELV & ICT partner in Saudi Arabia
              </p>
              <h1 className={isDark ? "max-w-xl text-4xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-6xl" : "max-w-xl text-4xl font-black leading-[0.96] tracking-[-0.06em] text-[#111827] md:text-6xl"}>
                Complete <span className="text-[#9bdc62]">ELV & ICT</span>
                <br />
                Project Execution
              </h1>

              <div className={isDark ? "mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-200" : "mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-700"}>
                {[
                  "Skilled Teams",
                  "Reliable Execution",
                  "On-Time Delivery",
                ].map((item) => (
                  <span
                    key={item}
                    className={isDark ? "rounded-full border border-white/10 bg-[#142534] px-3 py-1.5 font-medium shadow-sm" : "rounded-full border border-black/5 bg-white px-3 py-1.5 font-medium shadow-sm"}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <p className={isDark ? "mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg" : "mt-6 max-w-xl text-base leading-8 text-zinc-600 md:text-lg"}>
                Saudi IT Mart provides project-based ELV, ICT and low-current installation solutions for contractors, businesses and construction projects across Riyadh and Saudi Arabia.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#project-cta"
                  onClick={scrollToCta}
                  className="inline-flex h-12 items-center rounded-full bg-[#0f1720] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1a242c]"
                >
                  Request a Project Quote <span className="ml-2">→</span>
                </a>
                <a
                  href="#services"
                  onClick={scrollToServices}
                  className={isDark ? "inline-flex h-12 items-center rounded-full border border-white/10 bg-[#142534] px-6 text-sm font-semibold text-slate-100 transition hover:border-white/20" : "inline-flex h-12 items-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-800 transition hover:border-black/15 hover:bg-zinc-50"}
                >
                  Our Services
                </a>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  "Experienced Technical Teams",
                  "Quality Workmanship",
                  "On-Time Delivery",
                  "Project Support Across KSA",
                ].map((item) => (
                  <div
                    key={item}
                    className={isDark ? "rounded-xl border border-white/10 bg-[#142534] px-2 py-3 text-center text-[11px] font-medium leading-5 text-slate-200" : "rounded-xl border-y border-black/5 px-2 py-3 text-center text-[11px] font-medium leading-5 text-zinc-700"}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-2 top-6 rounded-full border border-[#c8ed9e] bg-[#d9f6b0] px-3 py-2 text-xs font-semibold text-[#0f1720] shadow-sm sm:left-0">
                7+ Years Experience
              </div>
              <div className="absolute right-2 top-24 rounded-full border border-[#c8ed9e] bg-[#d9f6b0] px-3 py-2 text-xs font-semibold text-[#0f1720] shadow-sm sm:right-0">
                50+ Projects
              </div>
              <div className="absolute bottom-10 left-0 rounded-full border border-[#c8ed9e] bg-[#d9f6b0] px-3 py-2 text-xs font-semibold text-[#0f1720] shadow-sm">
                100+ Skilled Manpower
              </div>
              <div className="absolute bottom-0 right-4 rounded-full border border-[#c8ed9e] bg-[#d9f6b0] px-3 py-2 text-xs font-semibold text-[#0f1720] shadow-sm">
                100% Client Satisfaction
              </div>

              <Image
                src="/images/hero/hero-main.jpg"
                alt="Saudi IT Mart engineering team in Riyadh"
                width={1200}
                height={1200}
                className="mx-auto aspect-square w-full max-w-[600px] object-contain object-center lg:ml-auto lg:mr-0 lg:max-h-[560px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ isDark }: { isDark: boolean }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    const keyword = serviceSearch.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = activeCategory === "All" || service.category === activeCategory;
      const matchesSearch =
        !keyword ||
        `${service.title} ${service.description} ${service.category}`
          .toLowerCase()
          .includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, serviceSearch]);

  return (
    <>
      <section id="services" className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
                Our Services
              </p>
              <h2 className="text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-4xl">
                Complete ELV, ICT and Low-Current Solutions
              </h2>
            </div>
            <a
              href="#services"
              onClick={(event) => {
                event.preventDefault();
                setActiveCategory("All");
                setServiceSearch("");
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"
            >
              View All Services <span className="ml-2">→</span>
            </a>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            {serviceCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  activeCategory === category
                    ? "border-[#9bdc62] bg-[#aef06c] text-[#0f1720] shadow-sm"
                    : isDark
                      ? "border-white/10 bg-[#142534] text-slate-200 hover:border-white/20"
                      : "border-black/5 bg-white text-zinc-700 hover:border-black/10",
                ].join(" ")}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-5 flex justify-end">
            <input
              type="text"
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
              placeholder="Filter services by keyword"
              className={[
                "h-11 w-full max-w-xs rounded-full border px-4 text-sm shadow-sm outline-none placeholder:text-zinc-400 focus:border-[#9adf5e]",
                isDark
                  ? "border-white/10 bg-[#142534] text-white"
                  : "border-black/5 bg-white text-zinc-700",
              ].join(" ")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <article
                  key={service.title}
                  className={[
                    "group flex min-h-[390px] flex-col overflow-hidden rounded-[20px] border shadow-[0_15px_30px_rgba(17,24,39,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(17,24,39,0.09)] md:min-h-[430px] md:rounded-[24px]",
                    isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
                  ].join(" ")}
                >
                  <div className="relative">
                    {service.tag ? (
                      <span className="absolute right-4 top-4 z-10 rounded-full bg-[#0f1720] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                        {service.tag}
                      </span>
                    ) : null}
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={800}
                      height={520}
                      className="h-36 w-full object-cover transition duration-300 group-hover:scale-105 md:h-52"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3 md:p-5">
                    <div className="mb-3 flex items-center justify-between gap-2 md:mb-4 md:gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff6b5] text-xs font-black text-[#0f1720] md:h-11 md:w-11 md:text-sm">
                        {service.serial}
                      </div>
                      <span className="text-right text-[9px] font-semibold uppercase tracking-[0.08em] text-[#4a7b1d] md:text-[10px] md:tracking-[0.12em]">
                        {service.category}
                      </span>
                    </div>

                    <h3 className={isDark ? "text-base font-bold leading-tight tracking-[-0.03em] text-white md:text-2xl" : "text-base font-bold leading-tight tracking-[-0.03em] text-[#111827] md:text-2xl"}>
                      {service.title}
                    </h3>
                    <p className={isDark ? "mt-2 min-h-[56px] text-xs leading-5 text-slate-300 md:min-h-[48px] md:text-sm md:leading-6" : "mt-2 min-h-[56px] text-xs leading-5 text-zinc-600 md:min-h-[48px] md:text-sm md:leading-6"}>{service.description}</p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 md:gap-3 md:pt-5">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className={isDark ? "inline-flex items-center gap-1 text-xs font-semibold text-white md:gap-2 md:text-sm" : "inline-flex items-center gap-1 text-xs font-semibold text-[#0f1720] md:gap-2 md:text-sm"}
                      >
                        Learn More <span aria-hidden>→</span>
                      </button>
                      <span className="text-[10px] text-zinc-400 md:text-xs">{service.category}</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className={[
                "md:col-span-2 xl:col-span-3 rounded-[24px] border border-dashed p-8 text-center",
                isDark ? "border-white/10 bg-[#142534] text-slate-300" : "border-black/10 bg-white text-zinc-500",
              ].join(" ")}>
                No services match your current filter. Try another keyword or category.
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedService ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1720]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[30px] bg-[#f7f7f4] p-6 shadow-[0_20px_70px_rgba(15,23,32,0.28)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
                  {selectedService.category}
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#111827]">
                  {selectedService.title}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedService(null)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
                Close
              </button>
            </div>
            <Image src={selectedService.image} alt={selectedService.title} width={800} height={520} className="mb-5 h-56 w-full rounded-[22px] object-cover" />
            <p className="text-base leading-7 text-zinc-600">{selectedService.detail}</p>
            <div className="mt-6 flex justify-end">
              <a href="#project-cta" onClick={(event) => { event.preventDefault(); setSelectedService(null); document.getElementById("project-cta")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex h-11 items-center rounded-full bg-[#0f1720] px-5 text-sm font-semibold text-white">
                Request a Quote <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function AboutSection({ isDark }: { isDark: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="about" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className={[
            "overflow-hidden rounded-[30px] border p-3 shadow-[0_18px_40px_rgba(17,24,39,0.08)]",
            isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
          ].join(" ")}>
            <Image
              src="/images/about/about-main.png"
              alt="ELV and ICT infrastructure installation"
              width={960}
              height={780}
              className="h-[420px] w-full rounded-[24px] object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
              About Saudi IT Mart
            </p>
            <h2 className={isDark ? "text-3xl font-black tracking-[-0.05em] text-white md:text-5xl" : "text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-5xl"}>
              Good infrastructure should feel invisible.
            </h2>
            <p className={isDark ? "mt-5 text-base leading-8 text-slate-300 md:text-lg" : "mt-5 text-base leading-8 text-zinc-600 md:text-lg"}>
              Saudi IT Mart provides project-based ELV, ICT and low-current installation solutions for contractors, businesses and construction projects across Riyadh and Saudi Arabia. The company also supplies skilled manpower and can mobilize technical teams to execute projects independently.
            </p>

            {expanded ? (
              <p className={isDark ? "mt-4 text-base leading-8 text-slate-300 md:text-lg" : "mt-4 text-base leading-8 text-zinc-600 md:text-lg"}>
                We support contractors, developers, and facility owners with trusted execution, quality controls, and responsive project delivery from planning through commissioning.
              </p>
            ) : null}

            <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-7 inline-flex h-12 items-center rounded-full bg-[#0f1720] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1a242c]">
              {expanded ? "Show Less" : "Learn More"} <span className="ml-2">→</span>
            </button>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statItems.map((item) => (
                <div key={item.label} className={[
                  "rounded-[20px] border p-4 shadow-sm",
                  isDark ? "border-white/10 bg-[#142534]" : "border-black/5 bg-white",
                ].join(" ")}>
                  <div className={isDark ? "text-3xl font-black tracking-[-0.05em] text-white" : "text-3xl font-black tracking-[-0.05em] text-[#0f1720]"}>
                    {item.value}
                  </div>
                  <div className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-zinc-600"}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerBrandsSection({ isDark }: { isDark: boolean }) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  return (
    <>
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
                Our Partner Brands
              </p>
              <h2 className={isDark ? "text-3xl font-black tracking-[-0.05em] text-white md:text-4xl" : "text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-4xl"}>
                We use trusted global brands for reliable and professional solutions.
              </h2>
            </div>
            <button type="button" onClick={() => setShowAllBrands(true)} className={isDark ? "inline-flex h-11 items-center rounded-full border border-white/10 bg-[#142534] px-5 text-sm font-semibold text-slate-100 shadow-sm transition hover:bg-[#1b2f40]" : "inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50"}>
              View All Brands <span className="ml-2">→</span>
            </button>
          </div>

          <div className={[
            "grid gap-3 rounded-[28px] border p-4 shadow-[0_15px_30px_rgba(17,24,39,0.04)] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
            isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-white",
          ].join(" ")}>
              {partnerBrands.slice(0, 6).map((brand) => (
              <div
                  key={brand.name}
                className={[
                  "flex min-h-[90px] items-center justify-center rounded-[20px] border px-4 py-5 text-lg font-black tracking-[-0.04em] transition",
                  isDark ? "border-white/10 bg-[#142534] text-slate-200 hover:bg-[#193244] hover:text-white" : "border-black/5 bg-[#f7f7f4] text-zinc-600 hover:bg-white hover:text-[#0f1720]",
                ].join(" ")}
              >
                  <Image src={brand.image} alt={`${brand.name} logo`} width={180} height={72} className="h-10 w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {showAllBrands ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1720]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[30px] bg-[#f7f7f4] p-6 shadow-[0_20px_70px_rgba(15,23,32,0.28)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-3xl font-black tracking-[-0.05em] text-[#111827]">All Partner Brands</h3>
              <button type="button" onClick={() => setShowAllBrands(false)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
                Close
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partnerBrands.map((brand) => (
                <div key={brand.name} className="flex min-h-[110px] items-center justify-center rounded-[20px] border border-black/5 bg-white px-4 py-6">
                  <Image src={brand.image} alt={`${brand.name} logo`} width={220} height={88} className="h-12 w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ProjectsSection({ isDark }: { isDark: boolean }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);

  return (
    <>
      <section id="completed-projects" className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="mb-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
                Completed Projects
              </p>
              <h2 className={isDark ? "text-3xl font-black tracking-[-0.05em] text-white md:text-4xl" : "text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-4xl"}>
                Real Projects. Real Results.
              </h2>
            </div>
              <button type="button" onClick={() => setShowAllProjects(true)} className="inline-flex h-11 items-center rounded-full bg-[#0f1720] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1a242c]">
              View All Projects <span className="ml-2">→</span>
            </button>
          </div>

          <div className="grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <article
                key={project.name}
                className={[
                  "group overflow-hidden rounded-[24px] border shadow-[0_15px_30px_rgba(17,24,39,0.06)]",
                  isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
                  index === 0 ? "lg:col-span-2" : "",
                ].join(" ")}
              >
                <div className="relative">
                  {project.badge ? (
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-[#aef06c] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f1720]">
                      {project.badge}
                    </span>
                  ) : null}
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={900}
                    height={650}
                    className={[
                      "w-full object-cover transition duration-300 group-hover:scale-105",
                      index === 0 ? "h-[360px]" : "h-[250px]",
                    ].join(" ")}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4a7b1d]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#aef06c]" />
                    {project.location}
                  </div>
                  <h3 className={isDark ? "mt-3 text-2xl font-bold tracking-[-0.04em] text-white" : "mt-3 text-2xl font-bold tracking-[-0.04em] text-[#111827]"}>
                    {project.name}
                  </h3>
                  <p className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-zinc-600"}>{project.scope}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={isDark ? "text-sm font-medium text-slate-400" : "text-sm font-medium text-zinc-500"}>{project.date}</span>
                    <button type="button" onClick={() => setSelectedProject(project)} className="inline-flex h-10 items-center rounded-full bg-[#0f1720] px-4 text-xs font-semibold text-white transition hover:bg-[#1a242c]">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedProject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1720]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[30px] bg-[#f7f7f4] p-6 shadow-[0_20px_70px_rgba(15,23,32,0.28)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
                  {selectedProject.location}
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#111827]">
                  {selectedProject.name}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedProject(null)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
                Close
              </button>
            </div>
            <Image src={selectedProject.image} alt={selectedProject.name} width={900} height={620} className="mb-5 h-60 w-full rounded-[22px] object-cover" />
            <div className="flex items-center justify-between text-sm text-zinc-600">
              <span>{selectedProject.date}</span>
              <span>{selectedProject.scope}</span>
            </div>
            <p className="mt-5 text-base leading-7 text-zinc-600">{selectedProject.detail}</p>
          </div>
        </div>
      ) : null}

      {showAllProjects ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1720]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[30px] bg-[#f7f7f4] p-6 shadow-[0_20px_70px_rgba(15,23,32,0.28)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-3xl font-black tracking-[-0.05em] text-[#111827]">All Projects</h3>
              <button type="button" onClick={() => setShowAllProjects(false)} className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
                Close
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {projects.map((project) => (
                <div key={project.name} className="rounded-[24px] border border-black/5 bg-white p-4">
                  <Image src={project.image} alt={project.name} width={900} height={420} className="mb-4 h-40 w-full rounded-[18px] object-cover" />
                  <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.12em] text-[#4a7b1d]">
                    <span>{project.location}</span>
                    <span>{project.date}</span>
                  </div>
                  <h4 className="mt-3 text-xl font-bold text-[#111827]">{project.name}</h4>
                  <p className="mt-2 text-sm text-zinc-600">{project.scope}</p>
                  <button type="button" onClick={() => { setSelectedProject(project); setShowAllProjects(false); }} className="mt-4 inline-flex h-10 items-center rounded-full bg-[#0f1720] px-4 text-xs font-semibold text-white">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ClientsSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
          Our Clients & Partners
        </p>
        <h2 className={isDark ? "text-3xl font-black tracking-[-0.05em] text-white md:text-4xl" : "text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-4xl"}>
          Trusted by leading contractors, businesses and organizations across Saudi Arabia.
        </h2>

        <div className={[
          "mt-8 overflow-hidden rounded-[28px] border p-5 shadow-[0_15px_30px_rgba(17,24,39,0.04)] [contain:paint]",
          isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
        ].join(" ")}>
          <div className="client-marquee flex min-w-max gap-8 whitespace-nowrap text-3xl font-black tracking-[-0.05em] text-zinc-600">
            {[...clientLogos, ...clientLogos].map((logo, index) => (
              <span key={`${logo.name}-${index}`} className="inline-flex h-16 w-40 items-center px-4 py-2">
                <Image src={logo.image} alt={`${logo.name} logo`} width={160} height={64} className="h-12 w-full object-contain" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className={[
          "grid gap-6 rounded-[30px] border p-6 shadow-[0_18px_40px_rgba(17,24,39,0.06)] lg:grid-cols-[0.9fr_1.1fr]",
          isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
        ].join(" ")}>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4a7b1d]">
              Shop / Office Location
            </p>
            <h2 className={isDark ? "text-3xl font-black tracking-[-0.05em] text-white md:text-4xl" : "text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-4xl"}>
              Visit our Riyadh office or connect for onsite project support.
            </h2>
            <div className={isDark ? "mt-6 space-y-3 text-slate-300" : "mt-6 space-y-3 text-zinc-600"}>
              <p className="text-base">Saudi IT Mart</p>
              <p className="text-base">Riyadh, Saudi Arabia</p>
              <p className="text-base">Phone: +966 50 184 1918</p>
              <p className="text-base">Email: info@sauditmart.com</p>
            </div>
          </div>

          <div className={[
            "rounded-[26px] border p-4",
            isDark ? "border-white/10 bg-[#142534]" : "border-black/5 bg-white",
          ].join(" ")}>
            <div className="flex h-full min-h-[220px] items-center justify-center rounded-[20px] border border-dashed border-[#9bdc62] bg-[radial-gradient(circle_at_center,_rgba(155,220,98,0.14),_transparent_60%)] p-6 text-center">
              <div>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#dff6b5] text-2xl">📍</div>
                <p className={isDark ? "text-lg font-semibold text-white" : "text-lg font-semibold text-[#111827]"}>Saudi IT Mart Office</p>
                <p className={isDark ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-zinc-600"}>Serving contractors, developers, and IT projects throughout Riyadh and the Kingdom.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: "" }));
    setFormStatus("");
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) nextErrors.name = "Name is required.";
    if (!formData.company.trim()) nextErrors.company = "Company is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required.";
    else if (!/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) nextErrors.phone = "Enter a valid phone number.";
    if (!formData.project.trim()) nextErrors.project = "Project or service is required.";
    if (!formData.message.trim()) nextErrors.message = "Message is required.";

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateForm();
    setFormErrors(nextErrors);
    setFormStatus("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const message = encodeURIComponent(
      `New Project Inquiry - Saudi IT Mart\n\nName: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nProject / Service: ${formData.project}\n\nMessage:\n${formData.message}`,
    );
    const whatsappInquiryUrl = `${whatsappUrl}?text=${message}`;
    const whatsappWindow = window.open(whatsappInquiryUrl, "_blank", "noopener,noreferrer");

    if (whatsappWindow) {
      setFormStatus("Your inquiry has been prepared in WhatsApp. Please press Send to submit it.");
    } else {
      setFormStatus("WhatsApp could not be opened automatically. Please use the Chat on WhatsApp button below.");
    }
    setIsSubmitting(false);
  };

  return (
    <section id="project-cta" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="overflow-hidden rounded-[34px] bg-[#0d1720] px-6 py-7 text-white shadow-[0_20px_45px_rgba(15,23,32,0.2)] md:px-8 md:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.05em] text-white md:text-5xl">
                Have a New Project?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
                Send us your project details or manpower requirements. Our team will get back to you shortly.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="#project-cta" onClick={(event) => { event.preventDefault(); document.getElementById("project-cta")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="inline-flex h-12 items-center rounded-full bg-[#aef06c] px-6 text-sm font-semibold text-[#0f1720] transition hover:-translate-y-0.5">
                  Request a Quote <span className="ml-2">→</span>
                </a>
                <a href={`${whatsappUrl}?text=Hello%20Saudi%20IT%20Mart%2C%20I%20would%20like%20to%20discuss%20a%20new%20project.`} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/5">
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="rounded-[26px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <input
                    aria-label="Name"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={(event) => handleFieldChange("name", event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-300 outline-none"
                  />
                  {formErrors.name ? <div className="mt-1 px-2 text-xs text-red-300">{formErrors.name}</div> : null}
                </div>
                <div>
                  <input
                    aria-label="Company"
                    placeholder="Company"
                    required
                    value={formData.company}
                    onChange={(event) => handleFieldChange("company", event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-300 outline-none"
                  />
                  {formErrors.company ? <div className="mt-1 px-2 text-xs text-red-300">{formErrors.company}</div> : null}
                </div>
                <div>
                  <input
                    aria-label="Email"
                    placeholder="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-300 outline-none"
                  />
                  {formErrors.email ? <div className="mt-1 px-2 text-xs text-red-300">{formErrors.email}</div> : null}
                </div>
                <div>
                  <input
                    aria-label="Phone"
                    placeholder="Phone"
                    required
                    value={formData.phone}
                    onChange={(event) => handleFieldChange("phone", event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-300 outline-none"
                  />
                  {formErrors.phone ? <div className="mt-1 px-2 text-xs text-red-300">{formErrors.phone}</div> : null}
                </div>
                <div className="md:col-span-2">
                  <input
                    aria-label="Project or Service"
                    placeholder="Project / Service"
                    required
                    value={formData.project}
                    onChange={(event) => handleFieldChange("project", event.target.value)}
                    className="h-12 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-300 outline-none"
                  />
                  {formErrors.project ? <div className="mt-1 px-2 text-xs text-red-300">{formErrors.project}</div> : null}
                </div>
                <div className="md:col-span-2">
                  <textarea
                    aria-label="Message"
                    placeholder="Message"
                    required
                    value={formData.message}
                    onChange={(event) => handleFieldChange("message", event.target.value)}
                    className="h-24 w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-300 outline-none"
                  />
                  {formErrors.message ? <div className="mt-1 px-2 text-xs text-red-300">{formErrors.message}</div> : null}
                </div>
              </div>
              {formStatus ? <div role="status" aria-live="polite" className="mt-3 px-2 text-sm text-zinc-200">{formStatus}</div> : null}
              <button type="submit" disabled={isSubmitting} className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#aef06c] px-6 text-sm font-semibold text-[#0f1720] transition hover:-translate-y-0.5">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ isDark }: { isDark: boolean }) {
  const links = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Project Contracting", href: "#services" },
    { label: "Manpower Supply", href: "#services" },
    { label: "Completed Projects", href: "#completed-projects" },
    { label: "Our Brand Partners", href: "#partners" },
    { label: "Blog / News", href: "#home" },
    { label: "Contact Us", href: "#contact-us" },
  ];

  return (
    <footer id="contact-us" className="w-full">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-8">
        <div className={[
          "rounded-[30px] border p-6 shadow-[0_15px_28px_rgba(17,24,39,0.05)]",
          isDark ? "border-white/10 bg-[#0f1a24]" : "border-black/5 bg-[#f7f7f4]",
        ].join(" ")}>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/images/logo/site-logo.svg" alt="Saudi IT Mart logo" width={40} height={40} className="rounded-xl" />
                <div className={isDark ? "text-xl font-black tracking-tight text-white" : "text-xl font-black tracking-tight text-[#111827]"}>Saudi IT Mart</div>
              </div>
              <p className={isDark ? "mt-4 text-sm leading-7 text-slate-300" : "mt-4 text-sm leading-7 text-zinc-600"}>
                Project-based ELV, ICT and low-current solutions across Saudi Arabia.
              </p>
            </div>

            <div>
              <h3 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Quick Links</h3>
              <ul className={isDark ? "mt-4 space-y-2 text-sm text-slate-300" : "mt-4 space-y-2 text-sm text-zinc-600"}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(event) => {
                        event.preventDefault();
                        document.getElementById(link.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Contact</h3>
              <ul className={isDark ? "mt-4 space-y-2 text-sm text-slate-300" : "mt-4 space-y-2 text-sm text-zinc-600"}>
                <li>Riyadh, Saudi Arabia</li>
                <li><a href="tel:+966501841918" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>+966 50 184 1918</a></li>
                <li><a href="mailto:info@sauditmart.com" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>info@sauditmart.com</a></li>
                <li><a href="http://www.sauditmart.com" target="_blank" rel="noreferrer" className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>www.sauditmart.com</a></li>
              </ul>
            </div>

            <div>
              <h3 className={isDark ? "text-lg font-bold text-white" : "text-lg font-bold text-[#111827]"}>Follow Us</h3>
              <div className="mt-4 flex gap-3">
                {[
                  { label: "in", href: "https://www.linkedin.com" },
                  { label: "f", href: "https://www.facebook.com" },
                  { label: "yt", href: "https://www.youtube.com" },
                  { label: "wa", href: whatsappUrl },
                ].map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className={isDark ? "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#142534] text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5" : "flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-sm font-bold text-[#0f1720] shadow-sm transition hover:-translate-y-0.5"}>
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={isDark ? "mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-slate-300 md:flex-row md:items-center md:justify-between" : "mt-8 flex flex-col gap-4 border-t border-black/5 pt-5 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between"}>
            <div>© 2024 Saudi IT Mart. All Rights Reserved.</div>
            <div className="flex gap-5">
              <a href="#about" onClick={(event) => { event.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>Privacy Policy</a>
              <a href="#services" onClick={(event) => { event.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={isDark ? "hover:text-white" : "hover:text-[#0f1720]"}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const themeHydrated = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = window.localStorage.getItem("saudi-it-mart-theme");
      const initialTheme: ThemeMode = savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

      themeHydrated.current = true;
      window.localStorage.setItem("saudi-it-mart-theme", initialTheme);
      setTheme(initialTheme);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!themeHydrated.current) {
      return;
    }

    document.documentElement.classList.toggle("dark-theme", theme === "dark");
    document.documentElement.classList.toggle("light-theme", theme === "light");
    window.localStorage.setItem("saudi-it-mart-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <main className={isDark ? "min-h-screen w-full bg-[#09151d] text-white" : "min-h-screen w-full bg-[#dfe1dc] text-[#111827]"}>
      <div className="w-full">
        <div className={isDark ? "border border-white/10 bg-[#0b1821] shadow-[0_24px_60px_rgba(2,6,23,0.32)]" : "border border-black/5 bg-[#f1f2ee] shadow-[0_24px_60px_rgba(15,23,32,0.06)]"}>
          <Header theme={theme} onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))} />
          <Hero isDark={isDark} />
          <ServicesSection isDark={isDark} />
          <AboutSection isDark={isDark} />
          <div id="partners">
            <PartnerBrandsSection isDark={isDark} />
          </div>
          <ProjectsSection isDark={isDark} />
          <LocationSection isDark={isDark} />
          <ClientsSection isDark={isDark} />
          <CtaSection />
          <Footer isDark={isDark} />
        </div>
      </div>
    </main>
  );
}
