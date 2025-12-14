import { Card, CardContent } from "@/shared"
import { Skeleton } from "@/shared/components/ui/skeleton"

export const FileRowSkeleton = () => {
  return <Card className="border-brand-400 w-full p-4 animate-pulse">
    <CardContent className="grid sm:grid-cols-[10%_60%_auto] md:grid-cols-[10%_70%_auto] grid-cols-[20%_auto] w-full p-0 gap-2">
      <Skeleton className="h-full w-full rounded-md" />
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-[80%] h-4" />
      </div>
      <div className="gap-1 h-full items-center justify-end hidden sm:flex">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="w-10 h-10" />
        <Skeleton className="w-10 h-10" />
      </div>
    </CardContent>
  </Card>
};