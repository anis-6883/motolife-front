import { getSettings } from "@/actions/landing/settings-action";
import CustomToaster from "@/components/shared/CustomToaster";
import AuthProvider from "@/provider/AuthProvider";
import { SettingsProvider } from "@/provider/SettingsProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { DM_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settingsRes = await getSettings();
    const settings = settingsRes?.data?.status ? settingsRes.data.data : null;
    const APP_NAME = process.env.APP_NAME!;
    const openGraphTitle = settings?.openGraphTitle || APP_NAME;
    const openGraphDescription =
      settings?.openGraphDescription ||
      "Buy motorbikes and bike accessories online in Bangladesh. Shop from trusted vendors, compare prices, and get everything bike-related in one place.";
    const ogImage = settings?.openGraphImage || "/opengraph-image.png";
    const favIcon = settings?.favIcon || "/images/auth/logo.png";

    return {
      metadataBase: new URL(process.env.NEXTAUTH_URL!),
      title: APP_NAME,
      robots: "index, follow",
      applicationName: APP_NAME,
      description:
        "Buy motorbikes and bike accessories online in Bangladesh. Shop from trusted vendors, compare prices, and get everything bike-related in one place.",
      keywords: [
        APP_NAME,
        "buy motorbike",
        "buy bike",
        "buy bike accessories",
        "motorbike accessories",
        "bike accessories",
        "motorbike accessories online",
        "bike accessories online",
        "motorbike accessories in bangladesh",
        "bike accessories in bangladesh",
      ],
      manifest: "/manifest.webmanifest",
      icons: {
        icon: favIcon,
      },
      openGraph: {
        title: openGraphTitle,
        description: openGraphDescription,
        images: ogImage,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: process.env.APP_NAME || "MotoLife",
    } as Metadata;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const settingsRes = await getSettings();
  const settings = settingsRes?.data?.status ? settingsRes.data.data : null;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${dmSans.className} antialiased`} suppressHydrationWarning>
        <div className="relative z-50">
          <NextTopLoader color="#B21619" showSpinner={false} />
        </div>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SettingsProvider settings={settings}>
              {children}
              <CustomToaster />
            </SettingsProvider>
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            </ThemeProvider> */}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
