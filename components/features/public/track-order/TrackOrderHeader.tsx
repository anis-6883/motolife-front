"use client";

import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import routes from "@/config/routes";
import { SearchFormValues } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useForm } from "react-hook-form";

interface Props {
  orderId: string | null;
}

const TrackOrderHeader = ({ orderId }: Props) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: { search: "" },
  });

  const onSubmit = (data: SearchFormValues) => {
    router.replace(routes.publicRoutes.trackOrder + `?orderId=${data.search}`);
    reset();
  };

  return (
    <div className={`${orderId ? "justify-between" : "justify-center"} border-black/50 md:flex lg:pb-6`}>
      <div className="space-y-3 max-md:pb-4">
        <p className={`p-text-18 font-semibold ${orderId ? "" : "text-center"}`}>
          {orderId ? "Track Another Order" : "Check your order status"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <div className="flex w-md items-center rounded-lg border px-3 lg:w-xl">
            <Icons.search className="text-primary text-2xl" />
            <Input type="search" placeholder="Search by Order ID..." className="flex-1 border-0 bg-transparent" {...register("search")} />
          </div>

          <button type="submit" className="border-primary text-primary rounded-full border p-2">
            <ArrowRight />
          </button>
        </form>
      </div>

      {/* {orderId && (
        <Button variant="black" className="max-md:w-full">
          Download Invoice
          <Download className="h-4 w-4" />
        </Button>
      )} */}
    </div>
  );
};

export default memo(TrackOrderHeader);
