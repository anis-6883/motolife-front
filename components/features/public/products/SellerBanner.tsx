import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { BadgeCheck } from "lucide-react";

type SellerBannerProps = {
  seller: {
    shopName: string;
    bannerImage: string;
    shopLogo: string;
    isVerified?: boolean;
  };
};

const SellerBanner = ({ seller }: SellerBannerProps) => {
  const { shopName, bannerImage, shopLogo, isVerified = false } = seller;

  return (
    <div className="relative aspect-1400/900 w-full md:aspect-1400/400">
      {/* Banner */}
      <div className="relative aspect-1400/800 w-full overflow-hidden rounded-xl md:aspect-1400/350">
        <ImageWithFallback
          fallbackSrc="/images/shared/sellerProfile.png"
          src={bannerImage}
          fill
          alt={`${shopName} banner`}
          className="object-cover"
        />
      </div>

      {/* Bottom Left Vendor Strip */}
      <div className="absolute bottom-0 -left-1 md:bottom-6">
        <div
          className="flex items-center gap-6 bg-white px-10 py-3"
          style={{
            clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)",
          }}
        >
          {/* Logo */}
          <div className="relative size-20 overflow-hidden rounded-full">
            <ImageWithFallback
              fallbackSrc="/images/shared/shopLogo.png"
              src={shopLogo}
              alt={`${shopName} logo`}
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          <div className="p-text-30 flex items-center gap-1 font-bold text-black">
            {shopName}
            {isVerified && <BadgeCheck className="fill-blue-dark size-6 text-white" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerBanner;
