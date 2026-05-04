import { getCustomerAnnouncements } from "@/actions/landing/announcement-actions";
import Popup from "@/components/shared/announcements/Popup";
import { AnnouncementDisplayStyle } from "@/config/constant";
import { Announcement } from "@/lib/types";

export default async function PopupAnnouncements() {
  const data = await getCustomerAnnouncements();

  const popupMessages = (data?.data?.data || [])?.filter(
    (announcement: Announcement) => announcement.displayStyle === AnnouncementDisplayStyle.POPUP
  );

  return (
    <>
      {popupMessages.map((announcement: Announcement) => (
        <Popup key={announcement._id} announcement={announcement} />
      ))}
    </>
  );
}
