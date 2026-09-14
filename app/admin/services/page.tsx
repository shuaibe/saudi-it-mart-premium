import { getAdminServices } from "../../../lib/admin/data";
import { PageHeading } from "../components/page-heading";
import { AddServiceForm, ServiceForm } from "./service-form";

export default async function AdminServicesPage() {
  const services = await getAdminServices();
  return <div className="mx-auto max-w-6xl"><PageHeading eyebrow="Website service categories" title="Services" description="Add, edit, delete, or reorder service cards. Numbers are calculated from their saved order." /><AddServiceForm /><div className="grid gap-5 xl:grid-cols-2">{services.map((service, index) => <ServiceForm key={service.id} service={service} position={index + 1} total={services.length} />)}</div></div>;
}