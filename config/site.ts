import logoIconImg from "@/public/logo-short.svg";
import logoImg from "@/public/logo.svg";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "Motolife",
  description:
    "Buy motorbikes and bike accessories online in Bangladesh. Shop from trusted vendors, compare prices, and get everything bike-related in one place.",
  logo: logoImg,
  icon: logoIconImg,
  mode: MODE.LIGHT,
};

export const metaObject = (title?: string, openGraph?: OpenGraph, description: string = siteConfig.description): Metadata => {
  return {
    title: title ? `${title} - Motolife` : siteConfig.title,
    description,
    // openGraph: openGraph ?? {
    //     title: title ? `${title} - Motolife` : title,
    //     description,
    //     url: 'https://motolife.vercel.app',
    //     siteName: 'Motolife', // https://developers.google.com/search/docs/appearance/site-names
    //     images: {
    //         // url: 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/itemdep/isobanner.png',
    //         width: 1200,
    //         height: 630,
    //     },
    //     locale: 'en_US',
    //     type: 'website',
    // },
  };
};
