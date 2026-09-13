import { getAdminContactSettings } from "../../../lib/admin/data";
import { PageHeading } from "../components/page-heading";
import { ContactForm } from "./contact-form";

export default async function AdminContactPage() {
  const settings = await getAdminContactSettings();
  return <div className="mx-auto max-w-5xl"><PageHeading eyebrow="Contact and social" title="Contact & Social" description="Update the contact details and social destinations used by the header, CTA, location section, and footer." /><ContactForm settings={settings} /></div>;
}
