import { getAdminProjects } from "../../../lib/admin/data";
import { PageHeading } from "../components/page-heading";
import { ProjectForm } from "./project-form";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();
  return <div className="mx-auto max-w-6xl"><PageHeading eyebrow="Existing completed projects" title="Projects" description="Edit the project cards already displayed on the public website. No project creation or deletion workflow is included." /><div className="grid gap-5 xl:grid-cols-2">{projects.map((project) => <ProjectForm key={project.id} project={project} />)}</div></div>;
}
