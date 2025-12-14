import { Card, Progress } from "@/shared"
import { useUploadStore } from "../store"
import { getSizeText } from "@/lib/utils";
import { useEffect } from "react";

export const UploadQuota = () => {
  const storage = useUploadStore((state) => state.storage);
  const getStorageSpace = useUploadStore((state) => state.getStorageSpace);

  useEffect(() => {
    getStorageSpace();
  }, []);

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="text-h4 text-bold text-brand-400">Storage space avaialble
        {storage && <span>{`: `}{getSizeText(storage.remaining)}</span>}
      </div>
      {storage ?
        <Progress value={storage.used * 100 / (storage.used + storage.remaining)} /> :
        <Progress indeterminate />
      }
    </Card>
  );
}