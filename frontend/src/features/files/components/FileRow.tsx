import { Button, Card, CardContent, CardFooter } from "@/shared";
import { FileInfo } from "../types";
import { DownloadIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { previewUrl } from "../api";
import clsx from "clsx";
import { extensionFromMimeType, getSizeText } from "@/lib/utils";

export type FileRowProps = {
  fileInfo: FileInfo;
  disabled?: boolean;
  onDelete: (id: string) => Promise<void>;
  onDownload: (fileInfo: FileInfo) => void;
};

export type FileActionButtonsProps = {
  fileInfo: FileInfo;
  onDelete: FileRowProps["onDelete"];
  onDownload: FileRowProps["onDownload"];
  variant: ButtonGroupVariant;
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

enum ButtonGroupVariant {
  SIDE,
  BOTTOM,
};

const FileActionButtons = ({ fileInfo, onDelete, onDownload, variant }: FileActionButtonsProps) => {

  const onClickDownload = () => {
    onDownload(fileInfo);
  }

  const onClickDelete = () => {
    onDelete(fileInfo.id);
  }

  const onClickView = () => {
    window.open(previewUrl(fileInfo.id));
  }

  return <>
    <Button
      size={variant === ButtonGroupVariant.SIDE ? "icon" : "full"}
      onClick={onClickDownload}
      title="download"
    >
      <DownloadIcon />
    </Button>
    <Button
      size={variant === ButtonGroupVariant.SIDE ? "icon" : "full"}
      className="border-primary"
      variant={"outline"}
      onClick={onClickView}
      title="view"
    >
      <EyeIcon />
    </Button>
    <Button
      size={variant === ButtonGroupVariant.SIDE ? "icon" : "full"}
      variant="destructive"
      onClick={onClickDelete}
      title="delete"
    >
      <Trash2Icon />
    </Button>
  </>


};


export const FileRow = ({ fileInfo, disabled, onDelete, onDownload }: FileRowProps) => {



  return (
    <Card className={clsx("border-brand-400 w-full p-4 transition-opacity fade-in-50", disabled && "pointer-events-none opacity-50")}>
      <CardContent className="grid sm:grid-cols-[10%_60%_auto] lg:grid-cols-[10%_70%_auto] grid-cols-[20%_auto] w-full p-0 gap-2">
        <div className="flex h-full w-full sm:text-sm md:text-base text-xs font-bold bg-brand-400 text-black rounded-md items-center justify-center p-2">
          {extensionFromMimeType(fileInfo.type)}
        </div>
        <div className="flex flex-col items-start justify-center w-full min-w-0">
          <div className="font-bold sm:text-base text-sm w-full truncate">{fileInfo.name}</div>
          <div className="sm:text-sm text-xs">{formatDateTime(fileInfo.createdAt)} · {getSizeText(fileInfo.size)}</div>
        </div>
        <div className="gap-1 h-full items-center justify-end flex-wrap hidden sm:flex">
          <FileActionButtons
            fileInfo={fileInfo}
            onDelete={onDelete}
            onDownload={onDownload}
            variant={ButtonGroupVariant.SIDE}
          />
        </div>
      </CardContent>
      <CardFooter className="sm:hidden flex gap-1 py-2 px-0 w-full">
        <FileActionButtons
          fileInfo={fileInfo}
          onDelete={onDelete}
          onDownload={onDownload}
          variant={ButtonGroupVariant.BOTTOM}
        />
      </CardFooter>
    </Card>
  );
};