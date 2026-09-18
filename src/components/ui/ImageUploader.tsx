"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import ImageAdd01Icon from "@hugeicons/core-free-icons/ImageAdd01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import { useUploadImages } from "@/hooks/useUpload";
import type { UploadedFile, UploadFolder } from "@/lib/api";

interface ImageUploaderProps {
  folder: UploadFolder;
  max?: number;
  onChange: (files: UploadedFile[]) => void;
}

/** Multi-image picker (max 10) with previews, for services/jobs/disputes. */
export default function ImageUploader({ folder, max = 10, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const upload = useUploadImages(folder);

  const update = (next: UploadedFile[]) => {
    setFiles(next);
    onChange(next);
  };

  const handleSelect = (selected: FileList | null) => {
    if (!selected) return;
    const remaining = max - files.length;
    const batch = Array.from(selected).slice(0, Math.max(remaining, 0));
    if (batch.length === 0) return;
    upload.mutate(batch, {
      onSuccess: (uploaded) => update([...files, ...uploaded].slice(0, max)),
    });
  };

  const removeAt = (index: number) => update(files.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleSelect(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {files.map((file, i) => (
          <div key={`${file.publicId}-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
            <Image src={file.secureUrl || file.url} alt={`Upload ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
          </div>
        ))}
        {files.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-white transition-all flex flex-col items-center justify-center gap-1 text-gray-400 disabled:opacity-60"
          >
            <HugeiconsIcon icon={ImageAdd01Icon} size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {upload.isPending ? "Uploading…" : "Add photo"}
            </span>
          </button>
        )}
      </div>
      {upload.isError && (
        <p className="text-xs text-red-500 font-medium">
          {upload.error.message || "Upload failed"}
        </p>
      )}
      <p className="text-xs text-gray-400 font-medium">
        {files.length}/{max} photos · JPEG/PNG up to 5MB each
      </p>
    </div>
  );
}
