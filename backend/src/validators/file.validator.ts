import { z } from "better-auth/*";

export const FileMetadataSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  mimeType: z.string(),
});



