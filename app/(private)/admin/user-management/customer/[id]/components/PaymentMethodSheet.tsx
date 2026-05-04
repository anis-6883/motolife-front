import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import OfficeInfoCard from "./AddressInfoCard";
import { TAdress } from "./customer-profile-card";
// adjust import path as needed

interface ShippingAddressesSheetProps {
  isOpen: boolean;
  closeSheet: () => void;
  addresses: TAdress;
}

export function AddressViewSheet({ isOpen, closeSheet, addresses }: ShippingAddressesSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="overflow-y-auto sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl dark:text-white">All Shipping Addresses</SheetTitle>
        </SheetHeader>

        <div className="mt-4 h-[600px] w-full space-y-4 overflow-y-auto p-4">
          {addresses.length > 0 ? (
            addresses.map((item) => (
              <OfficeInfoCard
                key={item._id}
                name={item.title}
                address={item.address}
                district={item.district}
                thana={item.thana}
                area={item.area}
              />
            ))
          ) : (
            <p className="py-8 text-center text-neutral-500 dark:text-neutral-400">No shipping addresses found</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AddressViewSheet;
