"use client";

import { useMutation } from "@tanstack/react-query";
import {
  uploadImage,
  uploadImages,
  type UploadedFile,
  type UploadFolder,
} from "@/lib/api";

/** Upload a single image to a Cloudinary folder. */
export function useUploadImage(folder: UploadFolder) {
  return useMutation<UploadedFile, Error, File>({
    mutationFn: (file) => uploadImage(file, folder),
  });
}

/** Upload up to 10 images at once to a Cloudinary folder. */
export function useUploadImages(folder: UploadFolder) {
  return useMutation<UploadedFile[], Error, File[]>({
    mutationFn: (files) => uploadImages(files, folder),
  });
}
