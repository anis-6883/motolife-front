import { ShopInfo as ShopInfoType } from "@/types/shop";
import Image from "next/image";

interface ShopBannerProps {
  shop: ShopInfoType;
}

export default function ShopBanner({ shop }: ShopBannerProps) {
  const coverImage = shop?.store?.coverImage;

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-linear-to-br from-amber-50 via-orange-50 to-amber-100">
      {coverImage ? (
        <Image src={coverImage} alt="Shop Cover" fill className="object-cover" priority />
      ) : (
        <div className="absolute inset-0 flex items-end justify-center gap-4">
          <div className="h-20 w-14 rounded-t-sm bg-amber-100/80 shadow-md" />
          <div className="h-28 w-16 rounded-t-sm bg-amber-200/70 shadow-md" />
          <div className="h-16 w-12 rounded-t-sm bg-amber-100/80 shadow-md" />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 60% 40%, rgba(251,191,36,0.15) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
