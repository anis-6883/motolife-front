"use client";

import ImageWithFallback from "@/components/shared/ImageWithFallback";

interface RichTextPageHeaderProps {
  header: string;
}

export default function RichTextPageHeader({ header }: RichTextPageHeaderProps) {
  return (
    <div>
      {/* Banner Image */}
      <div className="relative aspect-16/3 lg:aspect-1400/80">
        <ImageWithFallback
          fallbackSrc="/images/shared/PolicyHeader.png"
          src="/images/shared/PolicyHeader.png"
          alt={`${header} header image`}
          fill
        />
      </div>

      {/* Title + Divider */}
      <div className="flex items-center pb-3 md:pb-5 lg:pb-10">
        <h1 className="p-text-48 leading-10 font-bold -tracking-[0.96px] md:leading-12 lg:leading-15">{header}</h1>

        <div className="from-dark-gray/50 h-px flex-1 bg-linear-to-l to-transparent" />
      </div>
    </div>
  );
}
