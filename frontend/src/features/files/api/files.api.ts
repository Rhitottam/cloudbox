import { API_BASE_URL } from "@/shared";
import { FileInfoListSchema, FileQueryOptions } from "../types";

export const loadFileList = async (options: FileQueryOptions) => {
  const { limit, sortOrder, sortBy, offset } = options;
  try {
    const url = new URL(`${API_BASE_URL}api/file/list`);
    url.search = new URLSearchParams({
      limit: limit.toString(),
      offset: offset?.toString() ?? '',
      sortOrder: sortOrder ?? '',
      sortBy: sortBy ?? '',
    }).toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });

    const data = await response.json();
    const parsed = FileInfoListSchema.safeParse(data.data);
    if (data.success && parsed.success) {
      return {
        success: data.success,
        data: parsed.data,
      };
    } else {
      return {
        success: false,
        message: 'Failed to get file list',
      };
    }

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get file list';
    return {
      success: false,
      message,
    };
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/file/${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });

    const data = await response.json();
    return {
      success: data.success,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed to delete file`;
    return {
      success: false,
      message,
    }
  }
};

export const downloadUrl = (fileId: string) => {
  return `${API_BASE_URL}api/file/download/${encodeURIComponent(fileId)}`;
};

export const previewUrl = (fileId: string) => {
  return `${API_BASE_URL}api/file/view/${encodeURIComponent(fileId)}`;
};