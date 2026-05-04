import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ProductCategory } from "@/lib/types";

export default function CategoryCard({ category }: { category: ProductCategory }) {
  return (
    <Card className="group h-full border py-1! shadow-none outline-none hover:shadow-md md:py-3! lg:py-6">
      <CardContent className="text-center capitalize max-md:px-1">
        <CardTitle className="sr-only">{category.name}</CardTitle>
        <div className="relative mx-auto aspect-square size-10 overflow-hidden rounded-full bg-[#F4F4F4] md:size-20 lg:size-40">
          <img alt={category.name} src={category.image} className="relative z-0 size-full rounded-full p-2 md:p-10" />
        </div>
        <p className="p-text-18 pt-1 max-md:text-xs max-md:leading-3 md:pt-3">{category.name}</p>
      </CardContent>
    </Card>
  );
}
