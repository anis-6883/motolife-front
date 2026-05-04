import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils"; // Optional utility for conditional classes
import React from "react";

type StarsProps = {
  rating: number;
  color?: string; // fill color
  outlineColor?: string; // border/empty color
  size?: string; // tailwind class for size (e.g., "h-5 w-5")
};

const StarsComp: React.FC<StarsProps> = ({ rating, color = "text-secondary", outlineColor = "text-white", size = "h-5 w-5" }) => {
  return (
    <div className="flex items-center space-x-px md:space-x-1 lg:space-x-2">
      {Array.from({ length: Math.ceil(rating) }).map((_, index) => {
        const filled = index + 1 <= Math.floor(rating);
        const hasHalf = index + 1 > Math.floor(rating) && index + 1 - rating <= 0.5;

        return (
          <span key={index} className={cn("relative inline-block", size)}>
            <Icons.star className={cn(size, outlineColor)} />
            {filled && (
              <Icons.star className={cn(size, color, `absolute top-0 left-0 fill-current transition-colors duration-500 ease-in-out`)} />
            )}
            {hasHalf && (
              <Icons.star className={cn(size, color, "absolute top-0 left-0 fill-current")} style={{ clipPath: "inset(0 50% 0 0)" }} />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarsComp;
