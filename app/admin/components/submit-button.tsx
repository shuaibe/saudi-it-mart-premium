"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Save changes" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f1720] px-5 text-sm font-semibold text-white transition hover:bg-[#1a242c] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}
