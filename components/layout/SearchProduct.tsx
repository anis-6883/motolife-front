import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

export default function SearchProduct() {
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowResults(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setSearchQuery("");
    setShowResults(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <div className="hidden flex-1 justify-center px-4 md:flex">
      <div className="relative w-full max-w-md md:max-w-xl" ref={searchRef}>
        <form className="flex items-center rounded-lg border border-[#A7A8AA4D] bg-white px-3" onSubmit={handleSearchSubmit}>
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
        </form>

        {/* Search Results Dropdown */}
        {showResults && (searchResults.length > 0 || isSearching) && (
          <Card className="absolute top-12 right-0 left-0 z-50 max-h-96 overflow-auto p-2 shadow-lg">
            {isSearching ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <>
                {searchResults.map((product: any, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-md p-2"
                    onClick={() => handleProductClick(product?.id)}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-muted-foreground text-xs">{product.category}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price.toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="mt-2 border-t pt-2 text-center">
                  <Button
                    variant="link"
                    className="text-xs"
                    onClick={() => {
                      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    View all results
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
