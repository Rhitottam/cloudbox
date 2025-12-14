export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE ?? 10;
export const MAX_UPLOAD_SIZE = import.meta.env.VITE_MAX_UPLOAD_SIZE ?? 53687091200;

export const ALLOWED_MIME_TYPES = {
  // Documents
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],

  // Images
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
  ],

  // Videos
  videos: [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ],

  // Audio
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/ogg',
  ],

  // Archives
  archives: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
  ],

  // Code
  code: [
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'text/markdown',
  ],
} as const;

// Flatten all allowed types
export const ALL_ALLOWED_MIME_TYPES = new Set(Object.values(ALLOWED_MIME_TYPES).flat()) as Set<string>;
