import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export interface BreadcrumbItemType {
  label: string | React.ReactNode;
  href?: string;
  isCurrentPage?: boolean;
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbItemType[];
  className?: string;
}

export default function DynamicBreadcrumb({ items, className }: DynamicBreadcrumbProps) {
  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrentPage = item.isCurrentPage || isLast;

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbItem className="capitalize">
                  {isCurrentPage ? (
                    <BreadcrumbPage className="text-primary text-sm font-bold dark:text-white">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href || "#"} className="hover:text-primary text-sm font-medium dark:text-white">
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="ms-1.5" />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
