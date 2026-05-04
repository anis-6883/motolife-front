import AddNewSaleButton from "@/components/admin/offers-management/offers/AddNewSaleButton";
import OffersDataTable from "@/components/admin/offers-management/offers/OffersDataTable";
import { IOffers } from "@/components/admin/offers-management/offers/types";
import { FormSheetProvider } from "@/context/FormSheetContext";

export default function OffersAndDeals({ data, vendorId }: { data: IOffers; vendorId?: string }) {
  return (
    <FormSheetProvider>
      <div className="mb-2 flex justify-end">
        <AddNewSaleButton />
      </div>
      <OffersDataTable data={data || []} vendorId={vendorId} />
    </FormSheetProvider>
  );
}
