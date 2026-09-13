"use client";

import { useActionState, useState } from "react";
import { replaceMediaAsset, type ActionResult } from "../../../lib/admin/actions";
import { ActionMessage } from "./action-message";
import { SubmitButton } from "./submit-button";

const initialState: ActionResult | null = null;

export function AssetUploadForm({ assetId, assetType }: { assetId: string; assetType: "hero" | "about" | "service" | "project" | "logo" | "other" }) {
  const [state, formAction] = useActionState(replaceMediaAsset, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const handleFile = (file: File | undefined) => {
    setFileError("");
    setPreview(null);
    if (!file) return;
    if (!/[.]((jpe?g)|(png)|(webp))$/i.test(file.name) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFileError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Images must be smaller than 5 MB.");
      return;
    }
    const image = new Image();
    image.onload = () => {
      if (image.width < 120 || image.height < 120 || image.width > 10000 || image.height > 10000) setFileError("Image dimensions must be between 120px and 10000px.");
      else setPreview(URL.createObjectURL(file));
    };
    image.onerror = () => setFileError("The selected file is not a readable image.");
    image.src = URL.createObjectURL(file);
  };

  return <form action={formAction} className="mt-4 space-y-3 border-t border-black/5 pt-4">
    <input type="hidden" name="replace_asset_id" value={assetId} /><input type="hidden" name="asset_type" value={assetType} />
    <label className="block text-sm font-semibold text-[#111827]">Upload replacement<input type="file" name="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => handleFile(event.target.files?.[0])} className="mt-2 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e6f8c9] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#315317]" /></label>
    {preview ? <img src={preview} alt="New image preview" className="h-24 w-full rounded-xl object-contain bg-[#f5f7f3] p-2" /> : null}
    {fileError ? <p className="text-sm text-red-700" role="alert">{fileError}</p> : null}
    <ActionMessage result={state} reset={() => undefined} /><SubmitButton label="Save replacement" />
  </form>;
}
