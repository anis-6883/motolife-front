import { PERMISSIONS } from "./constant";
import routes from "./routes";

const r = routes.privateRoutes.admin;

export const ROUTE_PERMISSION_MAP: Record<string, string> = {
  // Dashboard
  [r.dashboard]: PERMISSIONS.DASHBOARD,

  // Product Management
  [r.productManagement.productCategory.home]: PERMISSIONS.PRODUCT_CATEGORIES,
  [r.productManagement.brand.home]: PERMISSIONS.PRODUCT_BRAND,
  [r.productManagement.productAttribute.home]: PERMISSIONS.PRODUCT_ATTRIBUTES,
  [r.productManagement.productBenefit.home]: PERMISSIONS.PRODUCT_BENEFIT_SETUP,
  [r.productManagement.inHouseProduct.home]: PERMISSIONS.INHOUSE_PRODUCTS,
  [r.productManagement.vendorProduct.home]: PERMISSIONS.VENDOR_PRODUCTS,
  [r.productManagement.comboOffer.home]: PERMISSIONS.COMBO_OFFER,
  [r.productManagement.requestReStockList.home]: PERMISSIONS.REQUEST_RESTOCK,
  [r.productManagement.productUpdateRequests.home]: PERMISSIONS.PRODUCT_UPDATE_REQUEST,

  // User Management
  [r.userManagement.vendor.home]: PERMISSIONS.USER_VENDOR,
  [r.userManagement.vendor.moneyWithdraw]: PERMISSIONS.MONEY_WITHDRAW,
  [r.userManagement.customer.home]: PERMISSIONS.USER_CUSTOMER,
  [r.userManagement.manager.home]: PERMISSIONS.USER_MANAGER,

  // Order Management
  [r.orderManagement.order.home]: PERMISSIONS.ORDER,
  [r.orderManagement.refundRequest.home]: PERMISSIONS.REFUND_REQUEST,

  // Standalone modules
  [r.productReview.home]: PERMISSIONS.PRODUCT_REVIEW,
  [r.offerAndDealsManagement.offerList.home]: PERMISSIONS.OFFERS_AND_DEALS,
  [r.banners]: PERMISSIONS.BANNER_SETUP,
  [r.userRole]: PERMISSIONS.USER_ROLE_SETUP,
  [r.announcementSetup]: PERMISSIONS.ANNOUNCEMENT_SETUP,
  [r.helpAndSUpport.contactMail.home]: PERMISSIONS.HELP_AND_SUPPORT,
  [r.businessSettings]: PERMISSIONS.BUSINESS_SETTINGS,
  [r.inhouseShop]: PERMISSIONS.INHOUSE_SHOP,
  [r.settings]: PERMISSIONS.SETTINGS,
};
