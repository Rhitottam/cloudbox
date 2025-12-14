import { ChunkRepository, FileRepository, UploadRepository } from "@/repositories/interfaces";
import { StorageService } from "./interfaces";
import { FileMetadata, UploadStatus } from "@/models";
import { FileQueryOptions } from "@/validators";

export class FileService {
  constructor(
    private readonly storageService: StorageService,
    private readonly uploadRepository: UploadRepository,
    private readonly chunkRepository: ChunkRepository,
    private readonly fileRepository: FileRepository,
  ) { }

  async getFileList(userId: string, options: FileQueryOptions): Promise<FileMetadata[] | null> {
    return this.fileRepository.getFilesByUserId(userId, options);
  }

  async initiateUpload(userId: string, fileMetadata: Omit<FileMetadata, 'id' | 'userId' | 'createdAt'>) {
    const fileInfo = {
      ...fileMetadata,
      userId,
    };
    const uploadInfo = await this.storageService.initiateUpload(fileInfo);

    await this.fileRepository.saveFile({
      ...fileInfo,
      id: uploadInfo.fileId,
    });
    await this.uploadRepository.saveUpload(uploadInfo);
    return uploadInfo;
  }

  async uploadPart(uploadId: string, index: number, data: Buffer) {
    const chunkInfo = await this.storageService.uploadPart(uploadId, index, data);
    await this.chunkRepository.saveChunk(chunkInfo);
  }

  async completeUpload(uploadId: string) {
    const uploadInfo = await this.uploadRepository.getUploadById(uploadId);
    const chunks = await this.chunkRepository.getChunksByUploadId(uploadId);

    if (uploadInfo && chunks?.length) {
      const { fileId } = uploadInfo;
      const { url } = await this.storageService.completeUpload(uploadId, fileId, chunks);
      await this.uploadRepository.updateUploadStatus(uploadId, UploadStatus.UPLOADED);
      const fileInfo = await this.fileRepository.updateFile(fileId, { url });
      // Perform Cleanup of temporary upload data
      await this.uploadRepository.clearUpload(uploadId);
      await this.chunkRepository.clearChunks(uploadId);
      return fileInfo;
    }

    return null;
  }

  async abortUpload(uploadId: string) {
    const uploadInfo = await this.uploadRepository.getUploadById(uploadId);

    if (uploadInfo) {
      const { fileId } = uploadInfo;
      await this.storageService.abortUpload(uploadId);
      await this.uploadRepository.clearUpload(uploadId);
      await this.chunkRepository.clearChunks(uploadId);
      await this.fileRepository.deleteFile(fileId);
    }
  }

  async getFileMetadata(fileId: string) {
    return this.fileRepository.getFileInfo(fileId);
  }

  async downloadFile(fileId: string) {
    return this.storageService.retrieveFile(fileId);
  }

  async deleteFile(fileId: string) {
    await this.fileRepository.deleteFile(fileId);
    await this.storageService.deleteFile(fileId)
  }

} 