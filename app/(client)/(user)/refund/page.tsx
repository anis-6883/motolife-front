import { getRefunds } from "@/actions/customer/refund-actions";
import RefundListPage from "@/components/features/private/RefundListPage/RefundListPage";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.REFUND);

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const flatParams: Record<string, string> = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });

  const {
    data: { data },
  } = await getRefunds(flatParams);

  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <RefundListPage data={data} />
    </div>
  );
};

export default page;
