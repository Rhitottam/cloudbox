import { ALL_ALLOWED_MIME_TYPES } from '@/shared';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import mime from 'mime/lite';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAllowedMimeType(mimeType: string): boolean {
  return ALL_ALLOWED_MIME_TYPES.has(mimeType);
};

export function extensionFromMimeType(mimeType: string): string {
  return mime.getExtension(mimeType) ?? 'bin';
}

export function getSizeText(size: number) {
  if (size > 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
  if (size > 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }
  if (size > 1024) {
    return `${(size / (1024)).toFixed(2)} KB`
  }
  return `${size} bytes`
}