"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  endDate: string;
  className?: string;
  cardClassName?: string;
}

export function CountdownCard({ endDate, className = "", cardClassName = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(endDate).getTime() - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // initial calculation

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-1.5 rounded-lg backdrop-blur-sm md:w-full md:items-center md:gap-2 md:p-6 lg:px-2",
        className
      )}
    >
      <TimeCard label="Days" value={timeLeft.days} cardClassName={cardClassName} />
      <Separator />
      <TimeCard label="Hours" value={timeLeft.hours} cardClassName={cardClassName} />
      <Separator />
      <TimeCard label="Minutes" value={timeLeft.minutes} cardClassName={cardClassName} />
      <Separator />
      <TimeCard label="Seconds" value={timeLeft.seconds} cardClassName={cardClassName} />
    </div>
  );
}

const TimeCard = ({ value, label, cardClassName }: { value: number; label: string; cardClassName: string }) => (
  <div className="flex flex-col items-center justify-center">
    <Card
      className={`md:border-primary shadow-0 flex size-4 flex-col items-center justify-center rounded-lg border-transparent p-2 text-center md:size-10 ${cardClassName}`}
    >
      <div className="md:p-text-20 text-primary text-xs font-semibold">{String(value).padStart(2, "0")}</div>
    </Card>
    <div className="mt-1 text-xs text-black max-md:hidden">{label}</div>
  </div>
);

const Separator = () => <p className="p-text-18 -translate-y-1 text-black md:-translate-y-3">:</p>;
