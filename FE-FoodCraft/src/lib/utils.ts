import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}/storage/${path}`;
}
