import { CouponList } from "@/components/features/private/CouponsPage/CouponPage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.COUPONS);

const page = () => {
  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <CouponList />
    </div>
  );
};

export default page;
