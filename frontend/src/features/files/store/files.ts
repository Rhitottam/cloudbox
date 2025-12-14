import { create } from "zustand";
import { FileInfo, FileQueryOptions, LoadingStatus, SortOrder } from "../types";
import { deleteFile, downloadUrl, loadFileList } from "../api";
import { PAGE_SIZE } from "@/shared";
import { toast } from "sonner";
import { useUploadStore } from "@/features/upload";


interface FilesStore {
  fileIdList: string[];
  currentOffset: number | undefined;
  hasMore: boolean;
  sortBy?: string;
  sortOrder?: SortOrder;
  fileMap: Record<string, FileInfo>;
  fileListStatus: LoadingStatus;
  fileDeletions: Set<string>;
  loadFileList: () => Promise<void>;
  prependFile: (file: FileInfo) => void;
  deleteFile: (fileId: string) => Promise<void>;
  downloadFile: (file: FileInfo) => void;
  updateFileListQuery: (options: Omit<FileQueryOptions, 'limit' | 'offset'>) => Promise<void>;
}

const initial = {
  fileIdList: [],
  currentOffset: undefined,
  hasMore: true,
  sortOrder: undefined,
  sortBy: undefined,
  fileMap: {},
  fileDeletions: new Set<string>(),
  fileListStatus: LoadingStatus.IDLE,
  fileOpenStatus: LoadingStatus.IDLE,
}

export const useFilesStore = create<FilesStore>()((set, get) => ({
  ...initial,
  loadFileList: async () => {
    if (!get().hasMore) return;
    if (get().fileListStatus === LoadingStatus.LOADING) return;

    set({ fileListStatus: LoadingStatus.LOADING });
    const offset = get().currentOffset;
    const response = await loadFileList({
      limit: PAGE_SIZE,
      offset,
      sortBy: get().sortBy,
      sortOrder: get().sortOrder
    });
    if (response.success && response.data) {
      const { list, nextOffset, hasMore } = response.data;
      const idList = list.map((item) => item.id);
      const fileMap = list.reduce((acc, item) => ({
        ...acc,
        [item.id]: item,
      }), {} as FilesStore['fileMap']);
      set((state) => ({
        fileIdList: [...state.fileIdList, ...idList],
        currentOffset: nextOffset,
        hasMore,
        fileMap: {
          ...state.fileMap,
          ...fileMap
        },
      }));
    } else {
      toast.error('Failed to load files');
    }
    set({ fileListStatus: LoadingStatus.IDLE });
  },
  updateFileListQuery: async (options) => {
    const { sortOrder, sortBy } = options;
    set((state) => ({
      sortBy: sortBy ?? state.sortBy,
      sortOrder: sortOrder ?? state.sortOrder,
      fileIdList: [],
      fileMap: {},
      currentOffset: undefined,
    }))
    get().loadFileList();
  },
  prependFile: (fileInfo: FileInfo) => {
    set((state) => ({
      fileIdList: [fileInfo.id, ...state.fileIdList],
      currentOffset: (state.currentOffset ?? 0) + 1,
      fileMap: {
        ...state.fileMap,
        [fileInfo.id]: fileInfo,
      },
    }));
  },

  deleteFile: async (fileId: string) => {
    set((state) => ({
      fileDeletions: new Set([...state.fileDeletions, fileId])
    }));

    const response = await deleteFile(fileId);
    if (response.success) {
      set((state) => {
        const fileDeletions = state.fileDeletions;
        fileDeletions.delete(fileId);
        const fileIdList = state.fileIdList.filter((id) => id !== fileId);
        delete state.fileMap[fileId];
        return {
          fileDeletions: new Set([...fileDeletions]),
          fileIdList,
          fileMap: { ...state.fileMap },
        }
      });
      await useUploadStore.getState().getStorageSpace();
    } else {
      set((state) => {
        const fileDeletions = state.fileDeletions;
        fileDeletions.delete(fileId);
        return {
          fileDeletions: new Set([...fileDeletions]),
        }
      });
    }
  },

  downloadFile: async (fileInfo: FileInfo) => {
    try {
      const url = downloadUrl(fileInfo.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileInfo.name || 'download';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download file');
    }
  },

}))