import { PERMISSIONS } from "@/config/constant";
import { NAV_PERMISSION_MAP, NavItem } from "@/config/nav-config";
import routes from "@/config/routes";
// import { NAV_PERMISSION_MAP, NavItem } from "@/config/nav-config";

const r = routes.privateRoutes.admin;

// ── Route → permission ─────────────────────────────────────────────────────────

export const ROUTE_PERMISSION_MAP: Record<string, string> = {
  [r.dashboard]: NAV_PERMISSION_MAP.dashboard,
  [r.productManagement.productCategory.home]: NAV_PERMISSION_MAP.product_categories,
  [r.productManagement.brand.home]: NAV_PERMISSION_MAP.product_brand,
  [r.productManagement.productAttribute.home]: NAV_PERMISSION_MAP.product_attributes,
  [r.productManagement.productBenefit.home]: NAV_PERMISSION_MAP.product_benefit,
  [r.productManagement.inHouseProduct.home]: NAV_PERMISSION_MAP.inhouse_products,
  [r.productManagement.vendorProduct.home]: NAV_PERMISSION_MAP.vendor_products,
  [r.productManagement.comboOffer.home]: NAV_PERMISSION_MAP.combo_offer,
  [r.productManagement.comboOffer.comboBanner]: NAV_PERMISSION_MAP.combo_banner,
  [r.productManagement.damageProduct.home]: NAV_PERMISSION_MAP.damage_product,
  [r.productManagement.requestReStockList.home]: NAV_PERMISSION_MAP.request_restock,
  [r.productManagement.productUpdateRequests.home]: NAV_PERMISSION_MAP.product_update_request,
  [r.userManagement.vendor.home]: NAV_PERMISSION_MAP.user_vendor,
  [r.userManagement.vendor.moneyWithdraw]: NAV_PERMISSION_MAP.money_withdraw,
  [r.userManagement.customer.home]: NAV_PERMISSION_MAP.user_customer,
  [r.userManagement.manager.home]: NAV_PERMISSION_MAP.user_manager,
  [r.orderManagement.order.home]: NAV_PERMISSION_MAP.order,
  [r.orderManagement.refundRequest.home]: NAV_PERMISSION_MAP.refund_request,
  [r.productReview.home]: NAV_PERMISSION_MAP.product_review,
  [r.offerAndDealsManagement.offerList.home]: NAV_PERMISSION_MAP.offers_and_deals,
  [r.banners]: NAV_PERMISSION_MAP.banner_setup,
  [r.userRole]: NAV_PERMISSION_MAP.user_role_setup,
  [r.announcementSetup]: NAV_PERMISSION_MAP.announcement_setup,
  [r.helpAndSUpport.contactMail.home]: NAV_PERMISSION_MAP.help_and_support,
  [r.businessSettings]: NAV_PERMISSION_MAP.business_settings,
  [r.inhouseShop]: NAV_PERMISSION_MAP.inhouse_shop,
  [r.settings]: NAV_PERMISSION_MAP.settings,
};

// ── Parent permission map ──────────────────────────────────────────────────────

const PARENT_PERMISSION_MAP: Record<string, string[]> = {
  [PERMISSIONS.PRODUCT_MANAGEMENT]: [
    PERMISSIONS.PRODUCT_CATEGORIES,
    PERMISSIONS.PRODUCT_BRAND,
    PERMISSIONS.PRODUCT_ATTRIBUTES,
    PERMISSIONS.PRODUCT_BENEFIT_SETUP,
    PERMISSIONS.INHOUSE_PRODUCTS,
    PERMISSIONS.VENDOR_PRODUCTS,
    PERMISSIONS.COMBO_OFFER,
    PERMISSIONS.COMBO_BANNER,
    PERMISSIONS.DAMAGE_PRODUCT,
    PERMISSIONS.REQUEST_RESTOCK,
    PERMISSIONS.PRODUCT_UPDATE_REQUEST,
  ],
  [PERMISSIONS.USER_MANAGEMENT]: [PERMISSIONS.USER_VENDOR, PERMISSIONS.MONEY_WITHDRAW, PERMISSIONS.USER_CUSTOMER, PERMISSIONS.USER_MANAGER],
  [PERMISSIONS.ORDER_MANAGEMENT]: [PERMISSIONS.ORDER, PERMISSIONS.REFUND_REQUEST],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

export function resolvePermissions(userPermissions: string[]): string[] {
  const resolved = new Set<string>(userPermissions);

  for (const perm of userPermissions) {
    const children = PARENT_PERMISSION_MAP[perm];
    if (children) children.forEach((c) => resolved.add(c));

    for (const [parent, children] of Object.entries(PARENT_PERMISSION_MAP)) {
      if (children.includes(perm)) resolved.add(parent);
    }
  }

  return [...resolved];
}

export function getRequiredPermission(pathname: string): string | null {
  const match = Object.entries(ROUTE_PERMISSION_MAP)
    .sort(([a], [b]) => b.length - a.length)
    .find(([prefix]) => pathname.startsWith(prefix));

  return match ? match[1] : null;
}

export function filterSidebarByPermissions(navMain: NavItem[], permissions: string[]): NavItem[] {
  if (permissions.includes(PERMISSIONS.ALL)) return navMain;

  const filterItems = (items: NavItem[]): NavItem[] => {
    return items
      .map((item) => {
        if (item.items && item.items.length > 0) {
          const filteredChildren = filterItems(item.items);

          if (filteredChildren.length === 0 && !item.key) return null;

          return {
            ...item,
            items: filteredChildren,
          };
        }
        if (!item.key) return null;

        const required = NAV_PERMISSION_MAP[item.key];
        if (!required) return null;

        if (!permissions.includes(required)) return null;

        return item;
      })
      .filter((item): item is NavItem => Boolean(item));
  };

  return filterItems(navMain);
}

export function getFirstPermittedRoute(permissions: string[]): string {
  if (permissions.includes(PERMISSIONS.ALL)) {
    return routes.privateRoutes.admin.dashboard;
  }

  const match = Object.entries(ROUTE_PERMISSION_MAP).find(([, required]) => permissions.includes(required));

  return match?.[0] ?? routes.privateRoutes.admin.dashboard;
}
