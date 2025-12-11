import { ChunkInfo, UploadMetadata } from "@/models";
import { ChunkRepository, UploadRepository } from "./interfaces";
import { DatabaseType } from "@/database/setup";
import { upload as uploadSchema, chunk as chunkSchema } from "@/database/schemas";
import { eq } from "drizzle-orm";

export class SqliteUploadRepository implements UploadRepository {
  constructor(private readonly sqliteDb: DatabaseType) { }

  async getUploadById(uploadId: string): Promise<UploadMetadata | null> {
    const result = await this.sqliteDb.query.upload.findFirst({
      where: (upload, { eq }) => eq(upload.id, uploadId),
    });
    if (!result) return null;
    return result
  }
  async saveUpload(upload: Omit<UploadMetadata, "created_at">): Promise<void> {
    await this.sqliteDb.insert(uploadSchema).values({
      ...upload,
      createdAt: new Date(),
    });
    return;
  }
  async updateUploadStatus(uploadId: string, status: UploadMetadata["status"]): Promise<void> {
    await this.sqliteDb.update(uploadSchema).set({
      status,
    }).where(eq(uploadSchema.id, uploadId))
  }
}

export class SqliteChunkRepoistory implements ChunkRepository {
  constructor(private readonly sqlitedb: DatabaseType) { }

  async saveChunk(chunk: ChunkInfo): Promise<void> {
    await this.sqlitedb.insert(chunkSchema).values({
      ...chunk,
    });
    return;
  }
  async getChunksByUploadId(uploadId: string): Promise<ChunkInfo[] | null> {
    const results = await this.sqlitedb.query.chunk.findMany({
      where: (chunk, { eq }) => eq(chunk.uploadId, uploadId),
      orderBy: (chunk, { asc }) => asc(chunk.chunkIndex)
    });
    return results;
  }
}