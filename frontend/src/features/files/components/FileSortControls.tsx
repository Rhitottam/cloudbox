import { Button } from "@/shared";
import { CalendarArrowDownIcon, CalendarArrowUpIcon } from "lucide-react";
import { FileQueryOptions, SortOrder } from "../types";
import clsx from "clsx";

export type FileSortControlsProps = {
  updateSortControls: (options: Pick<FileQueryOptions, 'sortBy' | 'sortOrder'>) => void;
  disabled?: boolean;
  sortOrder?: FileQueryOptions["sortOrder"];
  sortBy?: FileQueryOptions["sortBy"];
};

export const FileSortControls = ({ updateSortControls, disabled, sortOrder, sortBy }: FileSortControlsProps) => {

  const handleNewestFirstSort = () => {
    updateSortControls({
      sortOrder: SortOrder.DESC,
      sortBy: "createdAt"
    });
  };

  const handleOldestFirstSort = () => {
    updateSortControls({
      sortOrder: SortOrder.ASC,
      sortBy: "createdAt"
    });
  };



  return (
    <div className="flex w-full gap-2 flex-row-reverse">
      <Button
        variant={"outline"}
        title="Newest First"
        disabled={disabled}
        onClick={handleNewestFirstSort}
        className={clsx({ ["hidden"]: sortOrder === SortOrder.DESC && sortBy === "createdAt" })}
      >
        <CalendarArrowDownIcon />
      </Button>
      <Button
        variant={"outline"}
        title="Oldest First"
        disabled={disabled}
        onClick={handleOldestFirstSort}
        className={clsx({ ["hidden"]: sortOrder === SortOrder.ASC && sortBy === "createdAt" })}
      >
        <CalendarArrowUpIcon />
      </Button>
    </div>
  );
}