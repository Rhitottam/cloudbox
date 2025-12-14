import { Card, Spinner, Progress } from "@/shared";
import clsx from "clsx";
import { ChangeEvent, DragEvent, useCallback, useMemo, useRef, useState } from "react"
import { useUploadStore } from "../store";
import { UploadStatus } from "../types";

export const UploadArea = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const initiateUpload = useUploadStore((state) => state.initiateUpload);
  const currentUpload = useUploadStore((state) => state.currentUpload);
  const uploadStatus = useUploadStore((state) => state.uploadStatus);
  const uploadedFile = useUploadStore((state) => state.uploadedFile);
  const uploadedChunks = useUploadStore((state) => state.uploadedChunks);

  const onInitiateUpload = useCallback((file?: File) => {
    if (uploadStatus === UploadStatus.IDLE && file) {
      initiateUpload(file);
    }
  }, [initiateUpload, uploadStatus]);


  const handleClickUpload = () => {
    if (fileInputRef.current && uploadStatus === UploadStatus.IDLE) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onInitiateUpload(file);
  };

  const handleDropFile = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onInitiateUpload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };


  const uploadProgress = useMemo(() => {
    if (!currentUpload?.totalChunks) return 0;
    return 100 * uploadedChunks.length / currentUpload?.totalChunks;
  }, [uploadedChunks.length, currentUpload?.totalChunks])




  return <Card
    onDrop={handleDropFile}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    role="button"
    ref={dragAreaRef}
    onClick={handleClickUpload}
    className={clsx("cursor-pointer rounded-3xl border-dashed w-full flex flex-col bg-transparent",
      "items-center justify-center h-[200px] p-4 border-card-foreground transition-all gap-2 border-4 border-spacing-2",
      "hover:scale-[1.01] hover:brightness-150 hover:animate-glow",
      isDraggingOver && "scale-[1.01] brightness-150 animate-glow"
    )}
  >
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      onChange={handleFileChange} />
    {
      uploadStatus === UploadStatus.IDLE &&
      <>
        <p className="text-h5 text-foreground fade-out-0">Upload files upto 50GB</p>
        <p className="text-sm text-muted-foreground fade-out-0"> Drop the files or Click to upload</p>
      </>
    }
    {
      (uploadedFile && uploadStatus !== UploadStatus.COMPLETED) &&
      <p className="text-base text-foreground max-w-[100] text-ellipsis overflow-hidden">{uploadedFile?.name}{` `}({uploadProgress.toFixed(0)}%)</p>
    }
    {
      uploadStatus === UploadStatus.PENDING &&
      <Spinner className="size-8" />
    }
    {
      (uploadStatus === UploadStatus.IN_PROGRESS &&
        uploadedChunks && currentUpload
      ) &&
      <Progress
        indeterminate={uploadedChunks.length === currentUpload?.totalChunks}
        value={uploadProgress}
      />
    }

  </Card>;

}