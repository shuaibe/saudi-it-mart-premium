"use client";

import { useActionState } from "react";
import { loginAdmin, type ActionResult } from "../../../lib/admin/actions";
import { SubmitButton } from "../components/submit-button";

const initialState: ActionResult | null = null;

export function LoginForm() {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-3xl border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,32,0.1)]">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#111827]">Admin email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#83c94d]" />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#111827]">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#83c94d]" />
      </div>
      {state ? <p role="alert" className={state.ok ? "rounded-xl bg-[#e6f8c9] px-4 py-3 text-sm text-[#315317]" : "rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"}>{state.message}</p> : null}
      <SubmitButton label="Log in" />
    </form>
  );
}
