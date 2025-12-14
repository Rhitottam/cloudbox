import { z } from "zod";

export const UploadPartSchema = z.object({
  index: z.number(),
  uploadId: z.string(),
});

export const UploadCompleteSchema = z.object({
  uploadId: z.string(),
});