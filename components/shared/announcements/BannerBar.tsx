import { AnnouncementType } from "@/config/constant";
import { Announcement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InfoIcon, PartyPopperIcon, SparkleIcon, TriangleAlertIcon } from "lucide-react";

const variants = {
  [AnnouncementType.INFORMATION]: {
    border: "border-blue-dark",
    bgLight: "bg-blue-light",
    bgDark: "bg-blue-dark",
    icon: InfoIcon,
  },
  [AnnouncementType.ALERT]: {
    border: "border-primary",
    bgLight: "bg-primary-light",
    bgDark: "bg-primary",
    icon: TriangleAlertIcon,
  },
  [AnnouncementType.PROMOTION]: {
    border: "border-purple-dark",
    bgLight: "bg-purple-light",
    bgDark: "bg-purple-dark",
    icon: PartyPopperIcon,
  },
  [AnnouncementType.UPDATE]: {
    border: "border-paste-dark",
    bgLight: "bg-paste-light",
    bgDark: "bg-paste-dark",
    icon: SparkleIcon,
  },
};

const getCurrentVariant = (type: Announcement["type"]) => {
  return variants[type] || variants[AnnouncementType.INFORMATION];
};

export default function BannerBar({ announcement }: { announcement: Announcement }) {
  const variant = getCurrentVariant(announcement.type);

  return (
    <div className={cn("flex gap-2 rounded border p-1 sm:rounded-md md:gap-5 md:rounded-xl md:p-3.5", variant.border, variant.bgLight)}>
      <div
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded text-white sm:size-8 sm:rounded-md md:size-15 md:rounded-lg",
          variant.bgDark
        )}
      >
        <variant.icon className="size-3.5 sm:size-4.5 md:size-8.5" />
      </div>
      <div className="text-foreground">
        <h4 className="text-sm font-semibold sm:text-base md:text-xl">{announcement.title}</h4>
        <p className="text-xs sm:text-sm md:text-lg">{announcement.message}</p>
      </div>
    </div>
  );
}
