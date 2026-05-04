import { getCustomerById, getCustomerOrdersById, getCustomerWishlistById } from "@/actions/admin/customer-management/get-customer";
import BreadcrumbWrapper from "@/components/shared/BreadcrumbWrapper";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import routes from "@/config/routes";
import { FormSheetProvider } from "@/context/FormSheetContext";
import { generatePageMetadata } from "@/lib/metadata";
import { TPageProps } from "@/lib/types";
import { Metadata } from "next";
import CustomerOrderTable from "./components/customer-orders-table";
import CustomerProfileCard from "./components/customer-profile-card";
import OrderStatsBanner from "./components/order-stats-banner";

export async function generateMetadata({ params }: TPageProps): Promise<Metadata> {
  const { id } = await params;
  return generatePageMetadata({
    title: "Customer Details",
    description: `Viewing details for customer ${id}`,
  });
}

const breadcrumbItems = [
  { label: "Dashboard", href: routes.privateRoutes.admin.dashboard },
  { label: "User Management", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Customers", href: routes.privateRoutes.admin.userManagement.customer.home },
  { label: "Customer Details" },
];

export default async function Page({ params }: TPageProps) {
  const flatParams: Record<string, string> = {};
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  Object.entries(params || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      flatParams[key] = value[0];
    } else if (value !== undefined) {
      flatParams[key] = value;
    }
  });
  const { id } = await params;
  const {
    data: { data: customer },
  } = await getCustomerById(id, flatParams);
  const {
    data: { data: orders },
  } = await getCustomerOrdersById(id, flatParams);

  const {
    data: { data: wishlist },
  } = await getCustomerWishlistById(id);
  console.log("wishlist", wishlist);
  if (!customer) return null;
  return (
    <FormSheetProvider>
      <BreadcrumbWrapper title="Customer Details" description="Manage specific customer information and history">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="mt-6 flex flex-col gap-6">
          <CustomerProfileCard
            customer={{
              _id: customer._id,
              name: customer.fullName,
              phone: customer.phone,
              email: customer.email,
              addresses: customer.addresses,
              status: customer.accountStatus,
              addressCount: customer.addresses?.length || 0,
              paymentMethods: customer.paymentMethods,
              paymentMethodCount: customer.paymentMethods?.length || 0,
              wishlistCount: customer.wishlistCount || 0,
              totalPoints: customer.totalPoints || 0,
              availablePoints: customer.availablePoints || 0,
            }}
            wishlist={wishlist || []}
          />
          <OrderStatsBanner
            stats={{
              totalOrder: customer?.orderStats?.totalOrders || 0,
              ongoing: customer?.orderStats?.ongoingOrders || 0,
              complete: customer?.orderStats?.completedOrders || 0,
              cancelled: customer?.orderStats?.cancelledOrders || 0,
            }}
          />
        </div>
        <CustomerOrderTable data={orders || []} customerId={customer._id} />
      </BreadcrumbWrapper>
    </FormSheetProvider>
  );
}
