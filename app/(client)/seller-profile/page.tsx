// import { ActiveFilters } from "@/components/features/public/products/ActiveFilters";
// import { FilterSidebar } from "@/components/features/public/products/FilterSidebar";
// import ProductList from "@/components/features/public/products/ProductList";
// import ProductListSkeleton from "@/components/features/public/products/ProductListSkeleton";
// import SellerBanner from "@/components/features/public/products/SellerBanner";
// import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
// import { Container } from "@/components/ui/container";
// import { allRoutes } from "@/config/constant";
// import { generatePageMetadata } from "@/lib/metadata";
// import { PAGE_METADATA } from "@/lib/metadata-constants";
// import { Metadata } from "next";
// import { Suspense } from "react";

// export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.SELLER_PROFILE);
// export default async function Page({ searchParams }: PageProps<"/product-list">) {
//   const params = await searchParams;

//   return (
//     <>
//       <BreadCrumbSection
//         options={[
//           { slug: "/", name: "Home" },
//           { slug: allRoutes.sellerProfile, name: "Seller Profile" },
//         ]}
//       />
//       <Container className="pt-3 pb-4 md:pb-6 lg:pt-5 lg:pb-8 xl:pb-11">
//         <SellerBanner
//           seller={{
//             shopName: "MotoGear BD",
//             bannerImage: "/images/shared/sellerProfile.png",
//             shopLogo: "/images/shared/shopLogo.png",
//             isVerified: true,
//           }}
//         />
//         <div className="flex gap-6 overflow-hidden pt-4 md:pt-6 lg:pt-7.5">
//           <div className="hidden lg:block">
//             <FilterSidebar variant="seller-profile" />
//           </div>
//           <div className="w-full md:flex-1">
//             <ActiveFilters variant="seller-profile" />

//             {/* Product Grid */}
//             <Suspense key={JSON.stringify(params)} fallback={<ProductListSkeleton variant="seller-profile" />}>
//               {/* Update Product List For Seller Profile */}
//               <ProductList params={params} variant="seller-profile" />
//             </Suspense>
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// }

const Page = () => {
  return <div></div>;
};

export default Page;
