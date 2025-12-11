import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { UploadStatus } from "@/models";

export const file = sqliteTable("file", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  url: text("url"),
  mimeType: text("mime_type").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
},
  (table) => [index("file_userId_idx").on(table.userId)]
);

export const chunk = sqliteTable("chunk", {
  uploadId: text("upload_id").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  size: integer("size").notNull(),
  etag: text("etag"),
},
  (table) => [
    unique("chunk_uploadId_chunkIndex_unique").on(table.uploadId, table.chunkIndex),
    index("chunk_uploadId_chunkIndex_idx").on(table.uploadId, table.chunkIndex)
  ]
);

export const upload = sqliteTable("upload", {
  id: text("id").primaryKey(),
  fileId: text("file_id").notNull().references(() => file.id, { onDelete: "cascade" }),
  totalChunks: integer("total_chunks").notNull(),
  status: text("status", { enum: [UploadStatus.PROCESSING, UploadStatus.UPLOADED, UploadStatus.ABORTED, UploadStatus.FAILED] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  size: integer("size").notNull(),
},
  (table) => [index("upload_fileId_idx").on(table.fileId)]
);

export const fileRelations = relations(file, ({ one }) => ({
  upload: one(upload, {
    fields: [file.id],
    references: [upload.fileId],
  }),
}));

export const uploadRelations = relations(upload, ({ many, one }) => ({
  chunk: many(chunk),
  file: one(file, {
    fields: [upload.fileId],
    references: [file.id],
  }),
}));

