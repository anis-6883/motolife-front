import { getCustomerOrder } from "@/actions/customer/order-actions";
import OrderDetailPage from "@/components/features/private/OrderHistoryPage/OrderDetailPage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.ORDER_HISTORY);

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const { data } = await getCustomerOrder(id);

  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <OrderDetailPage order={data?.data} />
    </div>
  );
};

export default page;
