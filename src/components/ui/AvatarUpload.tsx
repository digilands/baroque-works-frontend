"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import { useUploadImage } from "@/hooks/useUpload";
import type { UploadedFile, UploadFolder } from "@/lib/api";

interface AvatarUploadProps {
  folder?: UploadFolder;
  initialUrl?: string;
  onUploaded: (file: UploadedFile) => void;
}

/** Single-image picker with preview, used for profile photos. */
export default function AvatarUpload({
  folder = "user-profiles",
  initialUrl,
  onUploaded,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const upload = useUploadImage(folder);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    upload.mutate(file, {
      onSuccess: (uploaded) => {
        setPreview(uploaded.secureUrl || uploaded.url);
        onUploaded(uploaded);
      },
      onError: () => setPreview(initialUrl ?? null),
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={upload.isPending}
        className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors disabled:opacity-60"
      >
        {preview ? (
          <Image src={preview} alt="Profile photo" fill className="object-cover" />
        ) : (
          <span className="flex items-center justify-center w-full h-full">
            <HugeiconsIcon icon={ImageAdd01Icon} size={28} className="text-gray-400" />
          </span>
        )}
        {upload.isPending && (
          <span className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-bold">
            Uploading…
          </span>
        )}
      </button>
      {upload.isError && (
        <p className="text-xs text-red-500 font-medium">
          {upload.error.message || "Upload failed"}
        </p>
      )}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Profile photo
      </p>
    </div>
  );
}
