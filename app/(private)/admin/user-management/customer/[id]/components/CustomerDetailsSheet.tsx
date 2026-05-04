import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import OfficeInfoCard from "./AddressInfoCard";
import { CustomerProfile } from "./customer-profile-card";
import WishlistInfoCard from "./WishlistInfoCard";

// adjust import path as needed

interface ShippingAddressesSheetProps {
  isOpen: boolean;
  closeSheet: () => void;
  customerProfile: CustomerProfile;
  type: "address" | "payment" | "wishlist";
}

export function CustomerDetailsSheet({ isOpen, closeSheet, customerProfile, type }: ShippingAddressesSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="overflow-y-auto sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl dark:text-white">
            {type === "address" ? "All Shipping Addresses" : type === "payment" ? "All Payment Methods" : "Customer Wishlist"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 h-[600px] w-full space-y-4 overflow-y-auto p-4">
          {customerProfile.addresses.length > 0 && type === "address" ? (
            customerProfile.addresses.map((item) => (
              <OfficeInfoCard
                key={item._id}
                name={item.title}
                address={item.address}
                district={item.district}
                thana={item.thana}
                area={item.area}
              />
            ))
          ) : customerProfile.paymentMethods.length > 0 && type === "payment" ? (
            <WishlistInfoCard />
          ) : (
            <p className="py-8 text-center text-neutral-500 dark:text-neutral-400">No information found</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CustomerDetailsSheet;
