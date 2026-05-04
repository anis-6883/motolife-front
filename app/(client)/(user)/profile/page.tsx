import UserProfilePage from "@/components/features/private/ProfilePage/UserProfilePage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.PROFILE);
const page = () => {
  return <UserProfilePage />;
};

export default page;
