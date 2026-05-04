import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { GoFileCode } from "react-icons/go";

interface ExampleContainerProps {
  title: string | ReactNode;
  link: string;
  desc: string | ReactNode;
  children?: ReactNode;
}

export default function ExampleContainer({ title, link, desc, children }: ExampleContainerProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <Button className="cursor-pointer gap-0.5" variant="link">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            Code
          </Link>
          <GoFileCode />
        </Button>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
      {children}
    </div>
  );
}
