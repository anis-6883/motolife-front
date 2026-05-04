import WishListPage from "@/components/features/private/wishlist/WishListPage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.WISHLIST);

const page = () => {
  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <WishListPage />
    </div>
  );
};

export default page;
