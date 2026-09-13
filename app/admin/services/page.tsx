import { getAdminServices } from "../../../lib/admin/data";
import { PageHeading } from "../components/page-heading";
import { ServiceForm } from "./service-form";

export default async function AdminServicesPage() {
  const services = await getAdminServices();
  return <div className="mx-auto max-w-6xl"><PageHeading eyebrow="Existing website services" title="Services" description="Edit the current service cards, including the separate Power Supply entries. No new service workflow is included." /><div className="grid gap-5 xl:grid-cols-2">{services.map((service) => <ServiceForm key={service.id} service={service} />)}</div></div>;
}
