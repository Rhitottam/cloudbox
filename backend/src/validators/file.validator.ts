import { z } from "zod";

export const FileMetadataSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  mimeType: z.string(),
});



