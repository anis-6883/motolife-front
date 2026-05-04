"use client";

import { Icons } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { BsFacebook, BsInstagram, BsTelegram, BsTwitter, BsWhatsapp } from "react-icons/bs";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productUrl: string;
}

export function ShareModal({ isOpen, onClose, productTitle, productUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedTitle = encodeURIComponent(productTitle);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "x": // Twitter (X)
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;

      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;

      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;

      case "instagram":
        navigator.clipboard.writeText(productUrl);
        Toast.success("Link copied! You can paste it on Instagram.");
        return;

      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };
  const socialPlatforms = [
    {
      key: "facebook",
      icon: Icons.FacebookIconSolid,
      mobileIcon: BsFacebook,
      borderColor: "border-primary md:border-blue-500",
    },
    {
      key: "instagram",
      icon: Icons.InstagramSolid,
      mobileIcon: BsInstagram,
      borderColor: "border-primary md:border-pink-500",
    },
    {
      key: "x",
      icon: Icons.TwitterSolid,
      mobileIcon: BsTwitter,
      borderColor: "border-primary md:border-black",
    },
    {
      key: "whatsapp",
      icon: Icons.WhatsappSolid,
      mobileIcon: BsWhatsapp,
      borderColor: "border-primary md:border-green-400",
    },
    {
      key: "telegram",
      icon: Icons.TelegramSolid,
      mobileIcon: BsTelegram,
      borderColor: "border-primary md:border-blue-500",
    },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full border-0 p-0 md:max-w-2xl [&>button:first-of-type]:hidden">
        <DialogTitle className="sr-only">{productTitle}</DialogTitle>
        <Card className="relative bg-white p-2 text-center md:p-6">
          <button onClick={onClose} className="absolute top-4 right-4 shrink-0">
            <X className="size-6" />
          </button>
          <h2 className="p-text-30 font-bold -tracking-[0.3px]">Share this product</h2>

          <p className="p-text-14 text-gray-600">Share link via</p>

          {/* Social buttons */}
          <div className="flex justify-center gap-3 max-md:flex-wrap">
            {socialPlatforms.map(({ key, icon: Icon, mobileIcon: MobileIcon, borderColor }) => (
              <Button
                key={key}
                variant="link"
                size="icon"
                className={`size-10! rounded-full border border-inherit bg-transparent no-underline hover:no-underline md:size-14.5! md:size-15! ${borderColor}`}
                onClick={() => handleShare(key)}
              >
                <Icon className="size-7.5! max-md:hidden" />
                <MobileIcon className="size-6! md:hidden" />
              </Button>
            ))}
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2">
            <div className="mx-auto flex h-8 max-w-[70%] flex-1 items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 md:h-11 md:max-w-[85%]">
              <Icons.HyperLinkIcon className="h-5 w-5 shrink-0 text-gray-400" />
              <span className="truncate text-sm text-[#777]">{productUrl}</span>
            </div>

            <Button className="bg-primary/90 hover:bg-primary h-8 rounded-lg px-6 font-semibold text-white md:h-11" onClick={handleCopy}>
              {copied ? "COPIED" : "COPY"}
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
