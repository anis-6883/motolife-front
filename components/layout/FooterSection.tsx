"use client";
import { Button } from "@/components/ui/button";
import { allRoutes } from "@/config/constant";
import { cn } from "@/lib/utils";
import { useSettings } from "@/provider/SettingsProvider";
import Link from "next/link";
import { useState } from "react";
import LoginModal from "../features/auth/LoginModal";
import VendorAuthModal from "../features/auth/VendorLogin/VendorLoginModal";
import { Icons } from "../icons";
import ImageWithFallback from "../shared/ImageWithFallback";
import { Container } from "../ui/container";

export function Footer() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserLoginModalOpen, setIsUserLoginModalOpen] = useState(false);
  const [loginFormState, setLoginFormState] = useState("signup-form");
  const settings = useSettings();
  const logoSrc = settings?.logo || "/images/auth/logo.png";
  const tagline = settings?.tagline || "Your trusted marketplace for motor parts";
  const FooterLinks = [
    {
      title: "MY ACCOUNT",
      linksAry: [
        {
          title: "Login",
          url: allRoutes.bestSellers,
        },
        {
          title: "My Orders",
          url: allRoutes.orders,
        },
        {
          title: "Track Order",
          url: allRoutes.trackOrder,
        },
        // {
        //   title: "My Wishlist",
        //   url: allRoutes.wishlist,
        // },
      ],
    },
    {
      title: "HELP CENTER",
      linksAry: [
        {
          title: "Shipping & Delivery",
          url: allRoutes.shippingDelivery,
        },
        // {
        //   title: "Return & Refund",
        //   url: allRoutes.returnRefund,
        // },
        {
          title: "How to Sell",
          url: allRoutes.howToSell,
        },
        {
          title: "Contact",
          url: allRoutes.contact,
        },
      ],
    },
    // {
    //   title: "SELLER ZONE",
    //   linksAry: [
    //     {
    //       title: "Become A Seller",
    //       url: allRoutes.becomeASeller,
    //     },
    //     {
    //       title: "Login to Seller Panel",
    //       url: allRoutes.sellerLogin,
    //     },
    //   ],
    // },
  ];
  // const sellerZone = {
  //   title: "SELLER ZONE",
  //   linksAry: [
  //     {
  //       title: "Become A Seller",
  //       url: "signup-form",
  //     },
  //     {
  //       title: "Login to Seller Panel",
  //       url: "login-phone",
  //     },
  //   ],
  // };
  const contactObj = [
    {
      title: "Address",
      value: "Bangshal, Dhaka, Bangladesh",
    },
    {
      title: "Phone",
      value: "01322140062",
    },
    {
      title: "Email",
      value: "contact.motolife@gmail.com",
    },
  ];
  const policiesAry = [
    {
      title: "Terms & Conditions",
      url: allRoutes.termsConditions,
    },
    {
      title: "Privacy Policy",
      url: allRoutes.privacyPolicy,
    },
    {
      title: "Return & Refund Policy",
      url: allRoutes.returnRefund,
    },
    // {
    //   title: "Seller Policy",
    //   url: allRoutes.sellerPolicy,
    // },
  ];
  return (
    <footer className="border-b-primary border-t bg-[#F4F4F4] text-black max-md:pb-16 md:border-b-6">
      <Container className="pt-2 md:pt-8 lg:pt-10">
        <div className="flex justify-between border-b pb-1 max-md:flex-col md:items-center md:pb-3 lg:pb-6">
          <div className="">
            <div className="relative aspect-198/80 w-full max-w-24 md:mb-3 md:max-w-49.5">
              <Link href={"/"}>
                <ImageWithFallback fallbackSrc="/images/auth/logo.png" src={logoSrc} alt="at store" fill className="mb-4 object-contain" />
              </Link>
            </div>
            <p className="p-text-14 md:p-text-18 -leading-[0.18px] font-semibold">{tagline}</p>
          </div>
          <div className="">
            <p className="p-text-14 md:p-text-15 text-light-gray mb-2 font-semibold uppercase md:mb-4">Follow us</p>

            <div className="flex gap-3">
              <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                <Icons.FacebookIconSolid className="size-7.5!" />
              </Button>
              <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                <Icons.InstagramSolid className="size-7.5!" />
              </Button>
              <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                <Icons.TwitterSolid className="size-7.5!" />
              </Button>
              <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                <Icons.WhatsappSolid className="size-7.5!" />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-20 gap-y-1 py-3 md:grid-cols-3 lg:grid-cols-4 lg:py-6 xl:grid-cols-5">
          {/* Logo and Contact Section */}
          <div className="max-md:text-center xl:col-span-2">
            <h3 className="p-text-15 text-light-gray mb-1 font-semibold uppercase md:mb-3.5">CONTACTS</h3>
            <ul className="text-sm md:space-y-3">
              {contactObj.map((contact, index) => (
                <div key={index} className="">
                  <p className="p-text-14 text-dark-gray font-medium md:leading-5">{contact.title}</p>
                  <p className="p-text-16 leading-5.5">{contact.value}</p>
                </div>
              ))}
            </ul>
          </div>
          {FooterLinks.map((linkObj, index) => (
            <div key={index} className="max-md:hidden">
              <h3 className="p-text-15 text-light-gray mb-3.5 font-semibold uppercase max-md:text-center">{linkObj.title}</h3>
              <ul className="p-text-16 text-light-primary space-y-2 leading-5 max-md:grid max-md:grid-cols-2">
                {linkObj.linksAry.map((linkItem, indexN) => (
                  <li key={indexN} className={`${indexN % 2 === 0 ? "" : "max-md:text-right"}`}>
                    {linkItem.title !== "Login" ? (
                      <Link href={linkItem.url} className="transition-colors hover:text-black/80">
                        {linkItem.title}
                      </Link>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsUserLoginModalOpen(true);
                        }}
                        className="h-max! p-0! font-normal text-black capitalize transition-colors hover:text-black/80 hover:no-underline"
                        variant={"link"}
                      >
                        <span className="p-text-16">{linkItem.title}</span>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="grid grid-cols-2 md:hidden">
            {FooterLinks.map((linkObj, index) => (
              <div key={index}>
                <h3
                  className={cn(
                    "p-text-15 text-light-gray mb-1 font-semibold uppercase md:mb-3.5",
                    index % 2 === 0 ? "" : "max-md:text-right"
                  )}
                >
                  {linkObj.title}
                </h3>
                <ul className="p-text-16 text-light-primary leading-5 md:space-y-2">
                  {linkObj.linksAry.map((linkItem, indexN) => (
                    <li key={indexN} className={`${index % 2 === 0 ? "" : "max-md:text-right"}`}>
                      {linkItem.title !== "Login" ? (
                        <Link href={linkItem.url} className="transition-colors hover:text-black/80">
                          {linkItem.title}
                        </Link>
                      ) : (
                        <Button
                          onClick={() => {
                            setIsUserLoginModalOpen(true);
                          }}
                          className="h-max! p-0! font-normal text-black capitalize transition-colors hover:text-black/80 hover:no-underline"
                          variant={"link"}
                        >
                          <span className="p-text-16">{linkItem.title}</span>
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* <div>
            <h3 className="p-text-15 text-light-gray mb-3.5 font-semibold uppercase max-md:text-center">{sellerZone.title}</h3>
            <ul className="p-text-16 text-light-primary space-y-2 leading-5 max-md:grid max-md:grid-cols-2">
              {sellerZone.linksAry.map((linkItem, indexN) => (
                <li key={indexN} className={`${indexN % 2 === 0 ? "" : "max-md:text-right"}`}>
                  <Button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setLoginFormState(linkItem.url);
                    }}
                    className="h-max! p-0! font-normal text-black capitalize transition-colors hover:text-black/80 hover:no-underline"
                    variant={"link"}
                  >
                    {linkItem.title}
                  </Button>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
        <div className="flex items-center justify-between gap-y-1 border-y py-1 max-lg:flex-col md:py-3.5">
          <div className="flex gap-x-8 max-md:flex-wrap max-md:justify-between xl:gap-x-10">
            {policiesAry.map((linkItem, index) => (
              <div key={index} className="p-text-16 text-light-primary space-y-2 leading-5">
                <Link href={linkItem.url} className="transition-colors hover:text-black/80">
                  {linkItem.title}
                </Link>
              </div>
            ))}
          </div>
          <div className="relative aspect-258/34 w-full max-w-64.5">
            <ImageWithFallback
              fallbackSrc="/images/shared/paymentMethods.png"
              src="/images/shared/paymentMethods.png"
              fill
              alt="payment methods"
            />
          </div>
        </div>
      </Container>

      <VendorAuthModal initialStep={loginFormState as any} open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      <LoginModal open={isUserLoginModalOpen} onOpenChange={setIsUserLoginModalOpen} />
      {/* Copyright Section */}
      <div className="border-t border-white/10 py-2 md:py-5">
        <div className="p-text-16 text-dark-gray container mx-auto text-center leading-6 md:px-4">
          Copyright ©2025 <span className="text-black">MotoLife</span>. All rights reserved
        </div>
      </div>
    </footer>
  );
}
