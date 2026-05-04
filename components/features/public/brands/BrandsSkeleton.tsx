import { Skeleton } from "@/components/ui/skeleton";

const BrandsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex aspect-280/219 flex-col items-center justify-between gap-3.25 rounded-lg border py-7">
          <div className="h-[58.4%] w-full overflow-hidden px-4">
            <Skeleton className="mx-auto h-full w-full rounded-md" />
          </div>
          <Skeleton className="mx-auto h-5 w-24 rounded-md" />
        </div>
      ))}
    </>
  );
};

export default BrandsSkeleton;
