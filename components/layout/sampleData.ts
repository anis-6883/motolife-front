import routes from "@/config/routes";
import { KeyRoundIcon, MapPin } from "lucide-react";
import { Icons } from "../icons";

export const menuItems = [
  { id: routes.privateRoutes.user.profile, label: "Profile", icon: KeyRoundIcon },
  { id: routes.privateRoutes.user.address, label: "Address", icon: MapPin },
  //   { id: routes.privateRoutes.user.paymentMethods, label: "Payment Methods", icon: Icons.paymentIcon },
  { id: routes.privateRoutes.user.wishlist, label: "My Wishlist", icon: Icons.heartIcon },
  { id: routes.privateRoutes.user.orders, label: "Order History", icon: Icons.orderConfirmIcon },
  //   { id: routes.privateRoutes.user.coupons, label: "Coupons", icon: Icons.coupon },
  //   { id: routes.privateRoutes.user.myQuestions, label: "My Questions", icon: LucideMessageCircleQuestionMark },
  { id: routes.privateRoutes.user.refund, label: "Refund", icon: Icons.RefundIconBW },
];
export const userObj = {
  name: "James Hall",
  imgURL: "./images/denim.png",
  email: "james.123@gmail.com",
};
