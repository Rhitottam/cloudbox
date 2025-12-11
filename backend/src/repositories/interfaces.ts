import { ChunkInfo, FileMetadata, UploadMetadata } from "@/models";

export interface FileRepository {
  getFilesByUserId(userId: string, limit: number, offset: number | undefined): Promise<FileMetadata[] | null>;
  getFileInfo(fileId: string): Promise<FileMetadata | null>;
  updateFile(fileId: string, update: Partial<Pick<FileMetadata, 'url' | 'name'>>): Promise<FileMetadata>;
  saveFile(file: Omit<FileMetadata, 'createdAt'>): Promise<void>;
  deleteFile(fileId: string): Promise<void>;
};

export interface UploadRepository {
  getUploadById(uploadId: string): Promise<UploadMetadata | null>;
  saveUpload(upload: Omit<UploadMetadata, 'createdAt'>): Promise<void>;
  updateUploadStatus(uploadId: string, status: UploadMetadata['status']): Promise<void>;
};

export interface ChunkRepository {
  saveChunk(chunk: ChunkInfo): Promise<void>;
  getChunksByUploadId(_uploadId: string): Promise<ChunkInfo[] | null>;
}