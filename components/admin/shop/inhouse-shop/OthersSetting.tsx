"use client";

import { updateInHouseShop } from "@/actions/admin/inhouse-shop/inhouse-shop-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormValues = {
  minimumOrderAmount: number;
};

type Props = {
  minOrderAmount: number;
};

const OthersSetting = ({ minOrderAmount }: Props) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      minimumOrderAmount: minOrderAmount || 0,
    },
  });
  const router = useRouter();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    reset({
      minimumOrderAmount: minOrderAmount || 0,
    });
  }, [minOrderAmount, reset]);

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const t = Toast.loading({
        title: "Updating",
        description: "Updating minimum order amount...",
      });

      try {
        await updateInHouseShop({
          businessSettings: {
            minOrderAmount: data.minimumOrderAmount,
          },
        });

        Toast.remove(t);

        Toast.success({
          title: "Success",
          description: "Minimum order amount updated successfully.",
        });
        router.refresh();
      } catch (error: unknown) {
        Toast.remove(t);

        Toast.error({
          title: "Failed",
          description: error instanceof Error ? error.message : "Failed to update settings.",
        });
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-xl border border-gray-200 bg-gray-100 p-6">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800">Order Setup</h2>
          <p className="mt-1 text-sm text-gray-500">Here you setup order amount and conditions for your customer.</p>

          {/* Form */}
          <div className="mt-4">
            <InputField
              name="minimumOrderAmount"
              label="Minimum Order Amount"
              placeholder="500"
              type="number"
              required
              inputClassName="max-w-md"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline-black"
              onClick={() =>
                reset({
                  minimumOrderAmount: minOrderAmount || 0,
                })
              }
              className="rounded-full border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
            >
              Reset
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isPending}
              className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default OthersSetting;
