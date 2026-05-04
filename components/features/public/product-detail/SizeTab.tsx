"use client";
import { SizeGuide } from "@/components/admin/restock-rquest/type";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState } from "react";
import SanitizedContent from "../shared/sanitizeContent";
import { MediaPreviewModal, ReviewMedia } from "./ReviewsTab";
type Props = { sizeChartAry: SizeGuide };

const SizeTab = ({ sizeChartAry }: Props) => {
  const [selectedMedia, setSelectedMedia] = useState<ReviewMedia | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="space-y-5">
        <SanitizedContent htmlString={sizeChartAry.description} />
      </div>

      {sizeChartAry.images.length > 0 && (
        <div className="mt-3.5 w-full rounded-md border p-2">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {sizeChartAry.images.map((image, index) => (
                <CarouselItem key={index} className="flex basis-2/5 justify-center sm:basis-2/9 lg:basis-2/17">
                  <div
                    onClick={() => {
                      setSelectedMedia({ src: image, type: "image" });
                      setModalOpen(true);
                    }}
                    className="relative aspect-square w-full cursor-pointer"
                  >
                    <ImageWithFallback fallbackSrc={"/images/auth/logo.png"} src={image} alt={`Size chart image: ${index + 1}`} fill />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <MediaPreviewModal open={modalOpen} media={selectedMedia} onClose={() => setModalOpen(false)} />
        </div>
      )}
    </>
  );
};

export default SizeTab;
