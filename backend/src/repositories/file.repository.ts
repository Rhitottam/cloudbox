import { file as fileSchema } from "@/database/schemas";
import { DatabaseType } from "@/database/setup";
import { FileMetadata } from "@/models";
import { eq } from "drizzle-orm";
import { FileRepository } from "./interfaces";

export class SqliteFileRepository implements FileRepository {

  constructor(private readonly sqliteDb: DatabaseType) { }

  async getFilesByUserId(userId: string, limit: number, offset: number | undefined) {
    const results = await this.sqliteDb.query.file.findMany({
      where: (file, { eq, and, isNotNull }) => and(eq(file.userId, userId), isNotNull(file.url)),
      limit,
      offset: offset ? Number(offset) : undefined,
      orderBy: (file, { desc }) => [desc(file.createdAt)],
    });
    return results
  }

  async getFileInfo(fileId: string): Promise<FileMetadata | null> {
    const result = await this.sqliteDb.select().from(fileSchema).where(eq(fileSchema.id, fileId));
    if (!result.length) return null;
    return result[0];
  }

  async updateFile(fileId: string, updates: Partial<Pick<FileMetadata, 'name' | 'url'>>) {
    const results = await this.sqliteDb.update(fileSchema).set({
      ...updates
    }).where(eq(fileSchema.id, fileId)).returning();
    return results[0];
  }

  async saveFile(file: Omit<FileMetadata, 'createdAt'>) {
    const createdFile = {
      ...file,
      createdAt: new Date(),
    };
    await this.sqliteDb.insert(fileSchema).values(createdFile);
  }

  async deleteFile(fileId: string) {
    await this.sqliteDb.delete(fileSchema)
      .where(eq(fileSchema.id, fileId));
  }

};
