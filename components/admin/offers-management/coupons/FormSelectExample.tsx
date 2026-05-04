"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import ComponentContainer from "./ComponentContainer";
import ExampleContainer from "./ExampleContainer";
import { MultiAsyncSelect } from "./MultiAsyncSelect";

const formSchema = z.object({
  cities: z.array(z.string()),
});

const FormSelectExample = () => {
  const [cities, setCities] = useState<{ label: string; value: string }[]>([{ label: "Paris", value: "PAR" }]);

  const { isPending, error, reset, mutate } = useMutation({
    mutationFn: async (searchString: string) => {
      const res = await fetch(`/api/city?keyword=${searchString}`);
      await new Promise((resolve) => setTimeout(resolve, 200));
      const data = await res.json();
      console.log(data);

      return data;
    },
    onSuccess: (data) => {
      setCities(data.data || []);
    },
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    if (!value) {
      // clear data
      reset();
    } else {
      mutate(value);
    }
  }, 100);

  // set default value
  const initData = {
    cities: ["PAR"],
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: initData,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // toast.success('Submit success', {
    //   description: JSON.stringify(data),
    // });
    console.log(data);
  };

  return (
    <ExampleContainer
      title="Using in Form"
      link="https://github.com/yayapao/shadcn-multi-async-select/blob/main/src/app/_example/form-select.tsx"
      desc={
        <>
          This example demonstrates how to use the MultiAsyncSelect component in{" "}
          <Link href="https://ui.shadcn.com/docs/components/form" target="_blank" rel="noopener noreferrer" className="underline">
            shadcn/ui Form.
          </Link>
        </>
      }
    >
      <ComponentContainer>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err);
            })}
          >
            <FormField
              control={form.control}
              name="cities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cities</FormLabel>
                  <FormControl>
                    <MultiAsyncSelect
                      loading={isPending}
                      error={error}
                      options={cities}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      onSearch={handleSearch}
                      className="w-[480px]"
                      searchPlaceholder="search city..."
                      placeholder="Select cities..."
                      maxCount={3}
                      async
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex justify-end">
              <Button type="submit" size="sm" className="cursor-pointer">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </ComponentContainer>
    </ExampleContainer>
  );
};

export default FormSelectExample;
