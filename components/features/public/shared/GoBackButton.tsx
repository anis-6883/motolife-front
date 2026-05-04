"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBackButton = ({ h1Text, btnClassName, h1ClassName }: { h1Text?: string; btnClassName?: string; h1ClassName?: string }) => {
  const router = useRouter();
  return (
    <div className="">
      <Button onClick={() => router.back()} variant={"link"} className={cn("text-black hover:no-underline", btnClassName)}>
        <ArrowLeft className="size-4" />
        <p className={cn("p-text-15 font-semibold uppercase")}>Go Back</p>
      </Button>
      {h1Text ? (
        <h1
          className={cn(
            "p-text-36 py-3 leading-6 font-bold -tracking-[0.72px] md:py-5 md:leading-8 lg:py-6 lg:leading-10 xl:leading-12",
            h1ClassName
          )}
        >
          {h1Text}
        </h1>
      ) : null}
    </div>
  );
};

export default GoBackButton;
