import { file as fileSchema } from "@/database/schemas";
import { DatabaseType } from "@/database/setup";
import { FileMetadata, SortOrder } from "@/models";
import { eq } from "drizzle-orm";
import { FileRepository } from "./interfaces";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { FileQueryOptions } from "@/validators";

export class SqliteFileRepository implements FileRepository {

  constructor(private readonly sqliteDb: DatabaseType) { }

  async getFilesByUserId(userId: string, options: FileQueryOptions) {
    const results = await this.sqliteDb.query.file.findMany({
      where: (file, { eq, and, isNotNull }) => and(eq(file.userId, userId), isNotNull(file.url)),
      limit: options.limit,
      offset: options.offset ? Number(options.offset) : undefined,
      orderBy: (file, { asc, desc }) => {
        let sortFunction = desc;
        let sortBy: SQLiteColumn = file.createdAt;
        if (options.sortOrder) {
          sortFunction = options.sortOrder === SortOrder.ASC ? asc : desc;
        }
        if (options.sortBy && file[options.sortBy] instanceof SQLiteColumn) {
          sortBy = file[options.sortBy];
        }
        return [sortFunction(sortBy)]
      },
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
