import { FileMetadata, UploadMetadata, ChunkInfo, UploadStatus } from "@/models";
import { StorageService } from "./interfaces";
import { v4 as uuid } from "uuid";
import { envConfig } from "@/config";
import { createReadStream, createWriteStream, mkdirSync, ReadStream, rmSync, statSync, writeFileSync } from "fs";
import path from "path";
import { pipeline } from "stream/promises";

export class LocalStorageService implements StorageService {

  private getPartId(partIndex: number) {
    return `part_${partIndex}`;
  }

  private getChunkUploadDirectory(uploadId: string) {
    return path.join(envConfig.TEMP_DIR, uploadId);
  }

  private getStoragePath(fileId: string) {
    return path.join(envConfig.STORAGE_DIR, fileId);
  }

  async initiateUpload(fileMetadata: Omit<FileMetadata, 'id' | 'createdAt'>): Promise<UploadMetadata> {
    const uploadId = uuid();
    const fileId = `${fileMetadata.userId}/file/${uploadId}`;
    const totalChunks = Math.ceil(fileMetadata.size / envConfig.CHUNK_SIZE);
    const uploadDirectory = this.getChunkUploadDirectory(uploadId);
    mkdirSync(uploadDirectory, { recursive: true });
    return {
      id: uploadId,
      fileId,
      totalChunks,
      status: UploadStatus.PROCESSING,
      createdAt: new Date(),
      size: fileMetadata.size
    };
  }

  async uploadPart(uploadId: string, partIndex: number, data: Buffer): Promise<ChunkInfo> {
    const uploadPath = path.join(this.getChunkUploadDirectory(uploadId), this.getPartId(partIndex));
    writeFileSync(uploadPath, data);
    return {
      uploadId,
      chunkIndex: partIndex,
      size: statSync(uploadPath).size,
    };
  }

  async completeUpload(uploadId: string, fileId: string, parts: ChunkInfo[]) {
    const uploadDirectory = this.getChunkUploadDirectory(uploadId);
    const storagePath = this.getStoragePath(fileId);

    parts.sort((part1, part2) => part1.chunkIndex - part2.chunkIndex);

    const writeStream = createWriteStream(storagePath);
    for (const part of parts) {
      const chunkPath = path.join(uploadDirectory, this.getPartId(part.chunkIndex));
      const readStream = createReadStream(chunkPath);
      await pipeline(readStream, writeStream, { end: false });
    }
    writeStream.end();

    rmSync(uploadDirectory, { recursive: true });

    return { url: storagePath };
  }

  async deleteFile(fileId: string): Promise<void> {
    const storagePath = this.getStoragePath(fileId);
    rmSync(storagePath, { recursive: true });
  }

  retrieveFile(fileId: string): ReadStream {
    return createReadStream(this.getStoragePath(fileId))
  }
}