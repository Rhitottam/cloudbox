import { FileInfoSchema } from "@/features/upload";
import z from "zod";

export enum LoadingStatus {
  IDLE,
  LOADING,
  COMPLETE,
};
export const FileInfoListSchema = z.object({
  list: z.array(FileInfoSchema),
  nextOffset: z.number(),
  hasMore: z.boolean(),
});

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
};

export type FileQueryOptions = {
  limit: number,
  offset?: number,
  sortOrder?: SortOrder,
  sortBy?: string,
};

export type { FileInfo } from "@/features/upload";

