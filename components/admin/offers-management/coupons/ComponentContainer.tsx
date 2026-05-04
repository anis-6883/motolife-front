import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function ComponentContainer({ children, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-[220px] flex-col items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}
