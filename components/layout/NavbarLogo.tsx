import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { allRoutes } from "@/config/constant";
import { cn } from "@/lib/utils";
import { useSettings } from "@/provider/SettingsProvider";
import { ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CategoryItem {
  name: string;
  url: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  name: string;
  url: string;
}

// const categories = [
//   { name: "Engine Oil", url: "/categories/engine-oil" },
//   {
//     name: "Helmet",
//     url: "/categories/helmet",
//     subCategories: [
//       { name: "Full Face Helmet", url: "/categories/helmet/full-face" },
//       { name: "Half Helmet", url: "/categories/helmet/half" },
//       { name: "Open Face Helmet", url: "/categories/helmet/open-face" },
//     ],
//   },
//   { name: "Locks", url: "/categories/locks" },
//   { name: "Parts", url: "/categories/parts" },
//   {
//     name: "Windbreaker & Jacket",
//     url: "/categories/windbreaker-jacket",
//     subCategories: [
//       { name: "Riding Jacket", url: "/categories/windbreaker-jacket/riding" },
//       { name: "Casual Jacket", url: "/categories/windbreaker-jacket/casual" },
//     ],
//   },
//   {
//     name: "Hand Gloves",
//     url: "/categories/hand-gloves",
//     subCategories: [
//       { name: "Leather Gloves", url: "/categories/hand-gloves/leather" },
//       { name: "Textile Gloves", url: "/categories/hand-gloves/textile" },
//     ],
//   },
//   { name: "Fog & LED", url: "/categories/fog-led" },
//   {
//     name: "Accessories",
//     url: "/categories/accessories",
//     subCategories: [
//       { name: "Mirrors", url: "/categories/accessories/mirrors" },
//       { name: "Grips", url: "/categories/accessories/grips" },
//     ],
//   },
//   { name: "Flamingo", url: "/categories/flamingo" },
// ];

export default function NavbarLogo({
  onOpenVendorModal,
  categories,
  onCategorySelect,
  onSubCategorySelect,
}: {
  onOpenVendorModal: (open: boolean) => void;
  categories: CategoryItem[];
  onCategorySelect: (name: string) => void;
  onSubCategorySelect: (name: string) => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settings = useSettings();
  const logoSrc = settings?.logo || "/images/auth/logo.png";

  return (
    <div className="z-20 flex items-center gap-2">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-70 flex-col justify-center rounded-r-4xl! border-0 bg-black/80 px-5 text-white backdrop-blur-3xl [&>button:first-of-type]:hidden [@media(min-width:400px)]:w-80"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">Public Navbar</SheetTitle>
            <div className="mb-6 flex items-center">
              <div className="relative aspect-video w-full max-w-40">
                <Image src={logoSrc} fill alt="Logo" className="object-contain" />
              </div>
            </div>
            {/* <div className="block">
              <LanguageSwitcher />
            </div> */}
          </SheetHeader>
          <Link
            href={allRoutes.home}
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-text-16 hover:text-primary font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href={allRoutes.brands}
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-text-16 hover:text-primary font-medium transition-colors"
          >
            Brands
          </Link>
          <Link
            href={allRoutes.comboOffers}
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-text-16 hover:text-primary font-medium transition-colors"
          >
            Combo Offer
          </Link>

          <Link
            href={allRoutes.trackOrder}
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-text-16 hover:text-primary font-medium transition-colors"
          >
            Track Order
          </Link>

          <Link
            href={allRoutes.contact}
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-text-16 hover:text-primary font-medium transition-colors"
          >
            Contact
          </Link>

          {/* <Link
            href={allRoutes.becomeASeller}
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-text-16 hover:text-primary font-medium transition-colors"
          >
            Become a Seller
          </Link> */}
          {/* 
          <Button
            variant="link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenVendorModal(true);
            }}
            className="p-text-16 hover:text-primary justify-start p-0 font-medium text-black hover:no-underline w-full"
          >
            <span className="p-text-16 font-medium capitalize">Become a Seller</span>
          </Button> */}
          <p className="p-text-16 text-primary border-primary w-full border-b pt-3 font-bold">Categories</p>
          <nav className="flex h-full flex-col gap-2 overflow-y-auto pb-6">
            {categories.map((category) => (
              <MobileCategoryItem
                key={category.name}
                category={category}
                onLinkClick={() => setIsMobileMenuOpen(false)}
                onCategorySelect={onCategorySelect}
                onSubCategorySelect={onSubCategorySelect}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <Link href="/" className="">
        <div className="relative aspect-104/42 h-12 w-20 md:h-14 md:w-28">
          <Image src={logoSrc} fill alt="Logo" className="object-contain" />
        </div>
      </Link>
    </div>
  );
}

interface MobileCategoryItemProps {
  category: CategoryItem;
  onLinkClick: () => void;
  onCategorySelect: (name: string) => void;
  onSubCategorySelect: (name: string) => void;
}

function MobileCategoryItem({ category, onLinkClick, onCategorySelect, onSubCategorySelect }: MobileCategoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!category.subCategories || category.subCategories.length === 0) {
    return (
      <button
        // href={category.url ?? "/"}
        className="hover:text-primary block w-full py-2 text-left text-base font-medium transition-colors"
        onClick={() => {
          onCategorySelect(category.name);
          onLinkClick();
        }}
      >
        {category.name}
      </button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="hover:text-primary flex w-full items-center justify-between py-2 text-base font-medium transition-colors">
        <span>{category.name}</span>
        <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pl-4">
        {category.subCategories.map((sub) => (
          <button
            key={sub.name}
            // href={sub.url}
            className="hover:text-primary block w-full py-1 text-left text-sm text-white/80 transition-colors"
            onClick={() => {
              onSubCategorySelect(sub.name);
              onLinkClick();
            }}
          >
            {sub.name}
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
