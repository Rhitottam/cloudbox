import { SortOrder } from "@/models";
import { z } from "zod";

export const FileMetadataSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  mimeType: z.string(),
});

export const FileQueryOptionsSchema = z.object({
  limit: z.number(),
  offset: z.number().optional(),
  sortBy: z.enum(['name', 'size', 'createdAt']).optional(),
  sortOrder: z.enum([SortOrder.ASC, SortOrder.DESC]).optional(),
});

export type FileQueryOptions = z.infer<typeof FileQueryOptionsSchema>;
