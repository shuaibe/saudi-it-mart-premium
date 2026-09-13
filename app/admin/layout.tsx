import { AdminNav } from "./components/admin-nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#eef1eb] lg:flex">
      <AdminNav />
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
