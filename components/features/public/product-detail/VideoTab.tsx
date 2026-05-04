"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { getYoutubeId } from "@/lib/helpers";
import Image from "next/image";
import { YouTubeVideoModal } from "./../shared/YouTubeVideoModal";

export function VideoTab({ videos }: { videos: string[] }) {
  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {videos.map((videoUrl, index) => {
          const videoId = getYoutubeId(videoUrl);

          if (!videoId) return null;

          return (
            <CarouselItem key={index} className="flex basis-full justify-center sm:basis-1/2 lg:basis-1/3">
              <div className="relative w-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt="Video thumbnail"
                  width={500}
                  height={500}
                  className="h-52 w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <YouTubeVideoModal videoId={videoId} title="Product Video" description="" triggerLabel="Play Video" />
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
