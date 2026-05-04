import { getProductBrands } from "@/actions/landing/product-brand-actions";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { allRoutes } from "@/config/constant";
import Link from "next/link";

export default async function BrandsGrid() {
  const { data: brands } = await getProductBrands();

  return brands?.data?.map((brand: any) => (
    <Link
      key={brand._id}
      href={`${allRoutes.products}?brand=${brand._id}`}
      className="flex aspect-280/219 h-full flex-col items-center justify-center gap-3.25 rounded-lg border py-4 hover:shadow-md"
    >
      <div className="h-[70%] overflow-hidden">
        <ImageWithFallback
          fallbackSrc="/images/auth/logo.png"
          height={128}
          width={128}
          alt={brand.name}
          src={brand.image}
          className="sm:object-fit mx-auto h-full object-contain object-bottom"
        />
      </div>
      <p className="font-dm-sans text-xs leading-[100%] font-semibold text-[#1A1A1A] max-md:text-center sm:text-lg">{brand.name}</p>
    </Link>
  ));
}
