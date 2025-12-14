import z from "zod";

export enum UploadStatus {
  IDLE,
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  FAILED,
}

export const UploadInfoSchema = z.object({
  id: z.string(),
  fileId: z.string(),
  totalChunks: z.number(),
  status: z.string(),
  createdAt: z.string(),
  size: z.number(),
});

export type UploadInfo = z.infer<typeof UploadInfoSchema>;

export const FileInfoSchema = z.object({
  id: z.string(),
  type: z.string(),
  size: z.number(),
  createdAt: z.string(),
  name: z.string(),
  url: z.string(),
});

export type FileInfo = z.infer<typeof FileInfoSchema>;

export const StorageInfoSchema = z.object({
  used: z.number(),
  remaining: z.number(),
});

export type StorageInfo = z.infer<typeof StorageInfoSchema>;