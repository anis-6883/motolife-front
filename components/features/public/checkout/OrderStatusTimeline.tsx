"use client";

import { Icons } from "@/components/icons";
import { stepsObj } from "../products/constants";

interface OrderStatusTimelineProps {
  status: keyof typeof stepsObj;
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  console.log("first", stepsObj, "status ", status);
  const stepIds = Object.keys(stepsObj) as Array<keyof typeof stepsObj>;

  const currentIndex = stepIds.findIndex((id) => id === status);

  return (
    <div className="relative mb-5 w-full lg:mb-7 xl:mb-12">
      <div className="flex items-start justify-center md:justify-between">
        {stepIds.map((id, index) => {
          const stepMeta = stepsObj[id];
          const Icon = Icons[stepMeta.icon];

          const isCompleted = index <= currentIndex;

          // const date = orderSteps[id];

          // const displayDate = date ? (isCompleted ? date : `Estimated date ${date}`) : "-";

          return (
            <div key={id} className="flex flex-1 flex-col items-center max-md:max-w-15">
              <div className="relative flex w-full items-center justify-center overflow-hidden">
                {index !== stepIds.length - 1 && (
                  <div className="border-primary absolute top-1/2 left-1/2 z-0 h-px w-1/2 border-b-2 border-dashed bg-transparent" />
                )}

                {index !== 0 && (
                  <div className="border-primary absolute top-1/2 -left-1 z-0 h-px w-1/2 border-b-2 border-dashed bg-transparent" />
                )}

                <div className="relative z-10 md:p-5">
                  {isCompleted ? (
                    <div className="bg-primary flex size-5 items-center justify-center rounded-full text-white md:size-9 lg:size-12">
                      <Icon className="max-md:size-4!" />
                    </div>
                  ) : (
                    <div className="border-primary text-primary flex size-5 items-center justify-center rounded-full border bg-white md:size-9 lg:size-12">
                      <Icon className="max-md:size-4!" />
                    </div>
                  )}
                </div>
              </div>

              <div className={isCompleted ? "" : "opacity-50"}>
                <p className="p-text-20 text-center font-semibold max-lg:text-sm max-md:px-1 max-md:text-[8px] max-md:leading-tight">
                  {stepMeta.label}
                </p>

                {/* <p className="p-text-16 text-center text-[#777] max-md:text-[8px] xl:px-20">{displayDate}</p> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
