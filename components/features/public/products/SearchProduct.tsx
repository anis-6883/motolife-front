"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearchQuery = useDebounce(searchQuery);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearchQuery === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    } else {
      params.delete("search");
    }
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, pathname, router, searchParams]);

  return (
    <div className="relative hidden w-full max-w-md md:block md:max-w-xl">
      <div className="flex items-center rounded-lg border border-[#A7A8AA4D] bg-white px-3">
        <Icons.search className="text-primary text-2xl" />
        <Input
          type="search"
          name="search"
          placeholder="Search for products..."
          className="flex-1 border-0 bg-transparent text-sm shadow-none ring-0 ring-offset-0 outline-none placeholder:text-base placeholder:text-[#A7A8AA] focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button size="icon" variant="ghost" className="size-7 text-black" onClick={() => setSearchQuery("")}>
            <XIcon className="size-4 cursor-pointer" />
          </Button>
        )}
      </div>
    </div>
  );
}
