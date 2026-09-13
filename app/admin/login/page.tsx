import { LoginForm } from "./login-form";

export const metadata = { title: "Admin Login | Saudi IT Mart" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe1dc] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4a7b1d]">Saudi IT Mart</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#111827]">Website Admin</h1>
          <p className="mt-2 text-sm text-zinc-600">Sign in to update the approved website content.</p>
        </div>
        <LoginForm />
        <p className="mt-5 text-center text-xs text-zinc-500">Owner access only. Registration is disabled.</p>
      </div>
    </main>
  );
}
