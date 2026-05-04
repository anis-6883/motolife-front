"use client";
import { Icons } from "@/components/icons";
import { menuItems } from "@/components/layout/sampleData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export type Option = {
  slug: string;
  name: string;
};

type UserBreadCrumbProps = {
  options?: Option[];
};

const BreadCrumbSection = ({ options }: UserBreadCrumbProps) => {
  const pathname = usePathname();

  const generatedOptions: Option[] = React.useMemo(() => {
    // Use passed options if provided
    if (options && options.length > 0) return options;

    if (!pathname) return [{ slug: "/", name: "Home" }];

    const segments = pathname.split("/").filter(Boolean);

    const pathOptions: Option[] = [
      { slug: "/", name: "Home" },
      ...segments.map((segment, idx) => {
        const slug = "/" + segments.slice(0, idx + 1).join("/");

        // ✅ Handle /orders/:id
        const isOrderDetails = segments[0] === "orders" && segments.length === 2 && idx === 1;

        if (isOrderDetails) {
          return {
            slug,
            name: "Order Details",
          };
        }

        // Try to find label from menuItems
        const menuItem = menuItems.find((item) => item.id === slug);

        const name = menuItem ? menuItem.label : segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

        return { slug, name };
      }),
    ];

    return pathOptions;
  }, [options, pathname]);

  return (
    <Breadcrumb className="p-text bg-dark-backround w-full py-3 max-md:hidden md:pt-5 lg:pt-7 lg:pb-4 xl:pt-8">
      <Container>
        <BreadcrumbList>
          {generatedOptions.map((item, index) => {
            const isLast = index === generatedOptions.length - 1;

            return (
              <React.Fragment key={item.slug}>
                <BreadcrumbItem className="capitalize">
                  {isLast ? (
                    <BreadcrumbPage>
                      <span className="p-text-16 leading-5 font-semibold text-black">{item.name}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.slug}>
                        <span className="p-text-16 text-black md:leading-6">{item.name}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && (
                  <BreadcrumbSeparator className="text-primary fill-primary">
                    <Icons.BulletPoint className="size-1.5!" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Container>
    </Breadcrumb>
  );
};

export default BreadCrumbSection;
