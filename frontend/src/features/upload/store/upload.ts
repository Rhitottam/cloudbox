import { create } from "zustand"
import { StorageInfo, UploadInfo, UploadStatus } from "../types";
import { toast } from "sonner";
import { abortUpload, completeUpload, getStorageSpaceUsed, initiateUpload, uploadPart } from "../api";
import { useFilesStore } from "@/features/files";

interface UploadStore {
  storage: null | StorageInfo,
  currentUpload: null | UploadInfo,
  uploadedChunks: any[],
  uploadedFile: null | File,
  uploadStatus: UploadStatus,
  getStorageSpace: () => Promise<void>,
  initiateUpload: (file: File) => Promise<void>,
  uploadParts: () => Promise<void>,
  completeUpload: () => Promise<void>,
  reset: () => void,
}

const initial = {
  storage: null,
  currentUpload: null,
  uploadedChunks: [],
  uploadedFile: null,
  uploadStatus: UploadStatus.IDLE,
}

export const useUploadStore = create<UploadStore>()((set, get) => ({
  ...initial,

  getStorageSpace: async () => {
    const data = await getStorageSpaceUsed();
    if (data.success) {
      set({
        storage: data.data,
      });
    } else {
      set({
        storage: null,
      });
    }
  },

  initiateUpload: async (file: File) => {
    const remaining = get().storage?.remaining ?? 0;
    if (remaining < file.size) {
      toast.error('Space unavailable for uploading this file');
      return;
    }
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
        set((state) => {
          return ({
            storage: state.storage ? {
              used: state.storage.used + data.data.size,
              remaining: state.storage.remaining - data.data.size,
            } : null,
          })
        });
      }
      else {
        await abortUpload(currentUpload.id);
        toast.error(data.message);
      }
      get().reset();
    }
  },

  reset: () => {
    set((state) => ({
      ...initial,
      storage: state.storage,
    }));
  }



}));