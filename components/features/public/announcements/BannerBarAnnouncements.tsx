import { getCustomerAnnouncements } from "@/actions/landing/announcement-actions";
import BannerBar from "@/components/shared/announcements/BannerBar";
import { AnnouncementDisplayStyle } from "@/config/constant";
import { Announcement } from "@/lib/types";

export default async function BannerBarAnnouncements() {
  const data = await getCustomerAnnouncements();

  const bannerMessages = (data?.data?.data || [])?.filter(
    (announcement: Announcement) => announcement.displayStyle === AnnouncementDisplayStyle.BANNER_BAR
  );

  if (bannerMessages.length === 0) return null;

  return (
    <div className="mb-2 space-y-4 md:mb-6 md:space-y-6">
      {bannerMessages.map((announcement: Announcement) => (
        <BannerBar key={announcement._id} announcement={announcement} />
      ))}
    </div>
  );
}
