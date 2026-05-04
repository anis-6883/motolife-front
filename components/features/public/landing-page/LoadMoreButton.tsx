import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const LoadMoreButton = ({
  url,
  willBeHidden,
  extraClassName = "md:hidden",
}: {
  url: string;
  willBeHidden?: boolean;
  extraClassName?: string;
}) => {
  return (
    <div className={cn("flex justify-center", willBeHidden ? "hidden" : "", extraClassName)}>
      <Button
        className={`hover:border-primary border-primary text-primary h-8 rounded-md border bg-white px-8 font-semibold uppercase transition-colors duration-500 hover:bg-black hover:text-white md:h-10`}
        asChild
      >
        <Link href={`${url}`}>
          Load More <ArrowUpRight />
        </Link>
      </Button>
    </div>
  );
};
