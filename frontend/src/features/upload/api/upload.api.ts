import { API_BASE_URL, MAX_UPLOAD_SIZE } from "@/shared";
import { FileInfoSchema, StorageInfoSchema, UploadInfoSchema } from "../types";
import { isAllowedMimeType } from "@/lib/utils";

export const getStorageSpaceUsed = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}api/file/storage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });
    const data = await response.json();
    const parsed = StorageInfoSchema.safeParse(data.data);
    if (data.success && parsed.success) {
      return {
        success: data.success,
        data: parsed.data,
      };
    } else {
      return {
        success: false,
        message: `Failed to get storage space`,
      };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed to get storage space`;
    return {
      success: false,
      message,
    };
  }
}

export const initiateUpload = async (file: File) => {
  if (file.size > MAX_UPLOAD_SIZE)
    return {
      success: false,
      message: 'Maximum file size allowed is 50GB'
    };
  if (!isAllowedMimeType(file.type)) {
    return {
      success: false,
      message: `Uploading files of ${file.type ?? 'unknown'} type is not allowed`,
    };
  }
  try {
    const response = await fetch(`${API_BASE_URL}api/file/upload/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        data: {
          name: file.name,
          type: file.type,
          mimeType: file.type,
          size: file.size,
        }
      })
    });
    const data = await response.json();
    const parsed = UploadInfoSchema.safeParse(data.data);
    if (data.success && parsed.success) {
      return {
        success: data.success,
        data: parsed.data,
      };
    } else {
      return {
        success: false,
        message: `Failed to Initiate upload of ${file.name}`,
      };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed to Initiate upload of ${file.name}`;
    return {
      success: false,
      message,
    };
  }
};

export const uploadPart = async (part: Blob, index: number, uploadId: string) => {
  try {
    const formatData = new FormData();
    formatData.append('chunk', part);
    formatData.append('data', JSON.stringify({ index, uploadId }));
    const response = await fetch(`${API_BASE_URL}api/file/upload/part`, {
      method: 'POST',
      credentials: "include",
      body: formatData,
    });
    const data = await response.json();
    return {
      success: data.success,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed to upload part`;
    return {
      success: false,
      message,
    };
  }
};

export const completeUpload = async (uploadId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/file/upload/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        data: {
          uploadId,
        }
      }),
    });

    const data = await response.json();
    const parsed = FileInfoSchema.safeParse(data.data);
    if (parsed.success) {
      return {
        success: data.success,
        data: parsed.data,
      };
    }
    else {
      return {
        success: false,
        message: 'Failed to upload',
      };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed to upload`;
    return {
      success: false,
      message,
    }
  }
};


export const abortUpload = async (uploadId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/file/upload/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        data: {
          uploadId,
        }
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : `Failed to abort upload`;
    return {
      success: false,
      message,
    }
  }
};