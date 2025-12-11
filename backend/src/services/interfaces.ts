import { ChunkInfo, FileMetadata, UploadMetadata } from "@/models";
import { ReadStream } from "fs";

export interface StorageService {

  initiateUpload(fileMetadata: Omit<FileMetadata, 'id' | 'createdAt'>): Promise<UploadMetadata>;

  uploadPart(uploadId: string, partIndex: number, data: Buffer): Promise<ChunkInfo>;

  completeUpload(uploadId: string, fileId: string, parts: ChunkInfo[]): Promise<{ url: string }>;

  deleteFile(fileId: string): Promise<void>;

  retrieveFile(fileId: string): ReadStream;
}