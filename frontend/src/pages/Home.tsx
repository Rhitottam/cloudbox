import { UploadArea } from "@/features/upload"
import { FileList } from '@/features/files';

export const Home = () => {
  return (
    <div className="p-4 flex flex-col gap-8 max-h-full h-full">
      <section className="contents">
        <UploadArea />
      </section>
      <section className="flex-1 h-full overflow-hidden">
        <FileList />
      </section>
    </div>
  )
}