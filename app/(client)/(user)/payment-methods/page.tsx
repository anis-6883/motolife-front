import { getCustomerPaymentMethods } from "@/actions/customer/profile-actions";
import PaymentMethodsPage from "@/components/features/private/PaymentMethodsPage/PaymentMethodsPage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.PAYMENT_METHODS);

const page = async () => {
  const { data } = await getCustomerPaymentMethods();

  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <PaymentMethodsPage paymentMethods={data?.data} />
    </div>
  );
};

export default page;
