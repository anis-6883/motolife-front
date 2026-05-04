import { getCustomerAnnouncements } from "@/actions/landing/announcement-actions";
import ScrollingMessage from "@/components/shared/announcements/ScrollingMessage";
import { AnnouncementDisplayStyle } from "@/config/constant";
import { Announcement } from "@/lib/types";

export default async function ScrollingAnnouncements() {
  const data = await getCustomerAnnouncements();

  const scrollingMessages = (data?.data?.data || [])?.filter(
    (announcement: Announcement) => announcement.displayStyle === AnnouncementDisplayStyle.SCROLLING_MESSAGE
  );

  return (
    <>
      {scrollingMessages.map((announcement: Announcement) => (
        <ScrollingMessage key={announcement._id} announcement={announcement} />
      ))}
    </>
  );
}
