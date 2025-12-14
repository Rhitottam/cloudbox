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