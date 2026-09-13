import { getAdminSiteSettings } from "../../../lib/admin/data";
import { PageHeading } from "../components/page-heading";
import { ContentForm } from "./content-form";

export default async function AdminContentPage() {
  const settings = await getAdminSiteSettings();
  return <div className="mx-auto max-w-5xl"><PageHeading eyebrow="Website details" title="Content" description="Edit the visible headings, descriptions, section labels, and SEO text already used by the public website." /><ContentForm settings={settings} /></div>;
}
