import { Metadata } from "next";

interface MetadataConfig {
  title: string;
  description: string;
  keywords?: readonly string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
}

// Base site configuration
const SITE_CONFIG = {
  name: process.env.APP_NAME || "Moto Life",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  defaultImage: "/images/og-default.jpg",
  twitterHandle: "@motolife",
};

/**
 * Generate complete metadata for any page
 */
export function generatePageMetadata({ title, description, keywords = [], image, url, noIndex = false }: MetadataConfig): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const metadataImage = image || SITE_CONFIG.defaultImage;

  // Make image URL absolute
  const absoluteImageUrl = metadataImage.startsWith("http") ? metadataImage : `${SITE_CONFIG.url}${metadataImage}`;

  const pageUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? [...keywords] : undefined,
    robots: noIndex ? "noindex,nofollow" : "index,follow",

    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: absoluteImageUrl, // Use absolute URL
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteImageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },

    alternates: {
      canonical: pageUrl,
    },
  };
}
