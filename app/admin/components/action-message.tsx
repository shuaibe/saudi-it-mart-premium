"use client";

import { useEffect } from "react";
import type { ActionResult } from "../../../lib/admin/actions";

export function ActionMessage({ result, reset }: { result: ActionResult | null; reset: () => void }) {
  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(reset, 5000);
    return () => window.clearTimeout(timer);
  }, [result, reset]);

  if (!result) return null;

  return (
    <p className={result.ok ? "rounded-xl bg-[#e6f8c9] px-4 py-3 text-sm text-[#315317]" : "rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"} role="status">
      {result.message}
    </p>
  );
}
