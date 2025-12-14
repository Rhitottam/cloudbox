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
export type { FileInfo } from "@/features/upload";

