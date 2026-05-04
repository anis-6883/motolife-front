import { getCustomerAddress } from "@/actions/customer/profile-actions";
import AddressBookPage from "@/components/features/private/AddressbookPage/AddressBookPage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.ADDRESS);

const page = async () => {
  const { data } = await getCustomerAddress();

  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <AddressBookPage
      // addresses={data?.data}
      />
    </div>
  );
};

export default page;
