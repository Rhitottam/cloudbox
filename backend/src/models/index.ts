export type UploadMetadata = {
  id: string;
  fileId: string;
  totalChunks: number;
  status: UploadStatus;
  createdAt: Date;
  size: number;
};

export type ChunkInfo = {
  uploadId: string;
  chunkIndex: number;
  size: number;
  etag?: string | null;
};

export type FileMetadata = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string | null;
  mimeType: string;
  createdAt: Date;
  userId: string;
};

export enum UploadStatus {
  UPLOADED = "uploaded",
  PROCESSING = "processing",
  FAILED = "failed",
  ABORTED = "aborted",
};

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
};