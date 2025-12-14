import { create } from "zustand"
import { UploadInfo, UploadStatus } from "../types";
import { toast } from "sonner";
import { abortUpload, completeUpload, initiateUpload, uploadPart } from "../api";
import { useFilesStore } from "@/features/files";

interface UploadStore {
  currentUpload: null | UploadInfo,
  uploadedChunks: any[],
  uploadedFile: null | File,
  uploadStatus: UploadStatus,
  initiateUpload: (file: File) => Promise<void>,
  uploadParts: () => Promise<void>,
  completeUpload: () => Promise<void>,
  reset: () => void,
}

const initial = {
  currentUpload: null,
  uploadedChunks: [],
  uploadedFile: null,
  uploadStatus: UploadStatus.IDLE,
}

export const useUploadStore = create<UploadStore>()((set, get) => ({
  ...initial,
  initiateUpload: async (file: File) => {
    set({ uploadStatus: UploadStatus.PENDING });
    const data = await initiateUpload(file);
    if (data.success) {
      set({ currentUpload: data.data, uploadStatus: UploadStatus.IN_PROGRESS, uploadedFile: file });
      await get().uploadParts();
    } else {
      get().reset();
      toast(data.message)
    }
  },
  uploadParts: async () => {
    const uploadedFile = get().uploadedFile;
    const currentUpload = get().currentUpload;
    if (uploadedFile && currentUpload) {
      const totalChunks = currentUpload.totalChunks;
      const chunkSize = Math.ceil(uploadedFile.size / totalChunks);
      for (let i = 0; i < totalChunks; i++) {
        const chunk = uploadedFile.slice(i * chunkSize, (i + 1) * chunkSize);
        const data = await uploadPart(chunk, i, currentUpload.id)

        if (data.success) {
          set((state) => ({
            uploadedChunks: [...state.uploadedChunks, { index: i, size: chunk.size }],
          }));
        } else {
          await abortUpload(currentUpload.id);
          toast(data.message);
          get().reset();
          return;
        }
      }
      await get().completeUpload();
    }
  },

  completeUpload: async () => {
    const currentUpload = get().currentUpload;
    const uploadedChunks = get().uploadedChunks;
    if (currentUpload?.totalChunks === uploadedChunks.length) {
      const data = await completeUpload(currentUpload.id);
      if (data.success && data.data) {
        useFilesStore.getState().prependFile(data.data);
      }
      else {
        await abortUpload(currentUpload.id);
        toast.error(data.message);
      }
      get().reset();
    }
  },

  reset: () => {
    set({
      ...initial
    });
  }



}));