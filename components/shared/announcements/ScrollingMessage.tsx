import { AnnouncementType } from "@/config/constant";
import { Announcement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { InfoIcon, PartyPopperIcon, SparkleIcon, TriangleAlertIcon } from "lucide-react";

const variants = {
  [AnnouncementType.INFORMATION]: {
    text: "text-blue-dark",
    border: "border-blue-dark",
    bgLight: "bg-blue-light",
    bgDark: "bg-blue-dark",
    icon: InfoIcon,
  },
  [AnnouncementType.ALERT]: {
    text: "text-primary",
    border: "border-primary",
    bgLight: "bg-primary-light",
    bgDark: "bg-primary",
    icon: TriangleAlertIcon,
  },
  [AnnouncementType.PROMOTION]: {
    text: "text-purple-dark",
    border: "border-purple-dark",
    bgLight: "bg-purple-light",
    bgDark: "bg-purple-dark",
    icon: PartyPopperIcon,
  },
  [AnnouncementType.UPDATE]: {
    text: "text-paste-dark",
    border: "border-paste-dark",
    bgLight: "bg-paste-light",
    bgDark: "bg-paste-dark",
    icon: SparkleIcon,
  },
};

const getVariant = (type: Announcement["type"]) => {
  return variants[type] || variants[AnnouncementType.INFORMATION];
};

const MarqueeContent = ({ variant, announcement }: { variant: any; announcement: Announcement }) => (
  <div className="flex shrink-0 items-center gap-1.5 pr-3.5 sm:gap-2 md:gap-3.5">
    <variant.icon className="size-3.5 shrink-0 sm:size-4 md:size-6.5" />
    <h4 className="text-sm font-semibold whitespace-nowrap sm:text-base md:text-xl">{announcement.title}</h4>
    <div className={cn("size-1 shrink-0 rounded-full sm:size-2", variant.bgDark)} />
    <p className="text-foreground text-xs whitespace-nowrap sm:text-sm md:text-lg">{announcement.message}</p>
  </div>
);

export default function ScrollingMessage({ announcement }: { announcement: Announcement }) {
  const variant = getVariant(announcement.type);

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden border p-1.5 sm:p-2.5 md:p-3.5",
        variant.border,
        variant.bgLight,
        variant.text
      )}
    >
      <div className="animate-marquee-infinite">
        {Array.from({ length: 10 }).map((_, i) => (
          <MarqueeContent key={i} variant={variant} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}
