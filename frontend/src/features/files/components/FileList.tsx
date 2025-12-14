import { useEffect, useRef } from "react";
import { useFilesStore } from "../store";
import { LoadingStatus } from "../types";
import { FileRow } from "./FileRow";
import { PAGE_SIZE } from "@/shared";
import { FileRowSkeleton } from "./FileRowSkeleton";
import { UploadStatus, useUploadStore } from "@/features/upload";
import { FileSortControls } from "./FileSortControls";

export const FileList = () => {
  const fileIdList = useFilesStore((state) => state.fileIdList);
  const fileMap = useFilesStore((state) => state.fileMap);
  const fileListStatus = useFilesStore((state) => state.fileListStatus);
  const loadFileList = useFilesStore((state) => state.loadFileList);
  const fileDeletions = useFilesStore((state) => state.fileDeletions);
  const deleteFile = useFilesStore((state) => state.deleteFile);
  const downloadFile = useFilesStore((state) => state.downloadFile);
  const updateSortControls = useFilesStore((state) => state.updateFileListQuery);
  const listSortOrder = useFilesStore((state) => state.sortOrder);
  const listSortBy = useFilesStore((state) => state.sortBy);


  const uploadStatus = useUploadStore((state) => state.uploadStatus);
  const isUploadInProgress = [UploadStatus.IN_PROGRESS, UploadStatus.PENDING].includes(uploadStatus);

  const isFileListLoading = fileListStatus === LoadingStatus.LOADING;

  const listBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadListObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && fileListStatus == LoadingStatus.IDLE) {
        loadFileList();
      }
    });
    if (listBottomRef.current) {
      loadListObserver.observe(listBottomRef.current)
    }

    return () => {
      if (listBottomRef.current) {
        loadListObserver.unobserve(listBottomRef.current)
      }
    }
  }, [loadFileList, fileListStatus]);

  return (
    <section className="flex flex-col gap-4 w-full h-full overflow-auto">
      {
        fileIdList.length === 0 && !isUploadInProgress && (
          <div className="h-full w-full border-dashed border-4 rounded-md border-gray-500 text-gray-500 text-h3 flex flex-col gap-2 items-center justify-center">
            <p className="text-h3 font-semibold text-gray-700">Your storage is empty</p>
            <p className="text-gray-500 text-base">
              Start by uploading your first file
            </p>
          </div>
        )
      }
      {
        fileIdList.length > 0 && (
          <FileSortControls
            updateSortControls={updateSortControls}
            disabled={isUploadInProgress || isFileListLoading}
            sortOrder={listSortOrder}
            sortBy={listSortBy}
          />
        )
      }
      {isUploadInProgress &&
        <FileRowSkeleton key={'uploading-skeleton'} />
      }
      {fileIdList.map((fileId) => (
        <FileRow
          key={fileId}
          fileInfo={fileMap[fileId]}
          disabled={fileDeletions.has(fileId)}
          onDelete={deleteFile}
          onDownload={downloadFile}
        />
      ))}
      {isFileListLoading &&
        [...Array(PAGE_SIZE).keys()].map((i) => (
          <FileRowSkeleton key={`${i}-skeleton`} />
        ))
      }
      <div ref={listBottomRef} id="list-loading-trigger" className="w-full h-1 opacity-0" />
    </section>
  );

};