import { FileMetadata, UploadMetadata, ChunkInfo, UploadStatus } from "@/models";
import { StorageService } from "./interfaces";
import { v4 as uuid } from "uuid";
import { envConfig } from "@/config";
import { createReadStream, createWriteStream, mkdirSync, readFileSync, ReadStream, rmSync, statSync, writeFileSync } from "fs";
import path from "path";

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
    const storageDirectory = storagePath.split("/").slice(0, -1).join("/")
    mkdirSync(storageDirectory, { recursive: true });
    parts.sort((part1, part2) => part1.chunkIndex - part2.chunkIndex);

    const writeStream = createWriteStream(storagePath);
    writeStream.on('error', (err) => {
      throw err;
    });
    for (const part of parts) {
      const chunkPath = path.join(uploadDirectory, this.getPartId(part.chunkIndex));
      const buffer = readFileSync(chunkPath);
      if (!writeStream.write(buffer)) {
        await new Promise<void>(resolve => writeStream.once('drain', resolve));
      }
    }
    await new Promise<void>((resolve, reject) => {
      writeStream.end(resolve);
      writeStream.on("error", reject)
    });
    rmSync(uploadDirectory, { recursive: true });

    return { url: storagePath };
  }

  async abortUpload(uploadId: string): Promise<boolean> {
    const uploadDirectory = this.getChunkUploadDirectory(uploadId);
    rmSync(uploadDirectory, { recursive: true });
    return true;
  }

  async deleteFile(fileId: string): Promise<void> {
    const storagePath = this.getStoragePath(fileId);
    rmSync(storagePath, { recursive: true });
  }

  retrieveFile(fileId: string): ReadStream {
    return createReadStream(this.getStoragePath(fileId))
  }
}