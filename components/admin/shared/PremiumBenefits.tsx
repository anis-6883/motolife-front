import { IProdBenefit } from "@/components/features/public/product-detail/schemas";
import { Icons } from "@/components/icons";
import { BadgeCheck } from "lucide-react";
// const defaultbenefitsAry: IProdBenefit = {
//   _id: "",
//   title: "Premium Benefites",
//   benefits: [
//     {
//       heading: "১০০% অরিজিনাল",
//       text: "আমরা শুধুমাত্র আসল ও মানসম্মত পণ্য সরবরাহ করি।",
//     },
//     {
//       heading: "দ্রুত তম সময়ে কুরিয়ার করা হয়।",
//       text: "দেশের যেকোনো প্রান্তে দ্রুত ও নিরাপদ ডেলিভারি।",
//     },
//     {
//       heading: "প্রডাক্ট চেক করে নেওয়ার সুযোগ।",
//       text: "ডেলিভারির সময় হাতে নিয়ে যাচাই করে তারপরই গ্রহণ করুন।",
//     },
//   ],
// };
const PremiumBenefits = ({ benefitsAry }: { benefitsAry?: IProdBenefit }) => {
  if (!benefitsAry?.benefits?.length) return null;
  return (
    <div className="h-max w-full overflow-hidden rounded-lg border">
      <div className="bg-dark-backround flex items-center gap-3 border-b px-3.5 py-2 text-black">
        <Icons.Crown /> <p className="p-text-16 flex-1 leading-5 font-semibold">Premium Benefites</p>
      </div>
      {benefitsAry?.benefits?.map((benefit, index) => (
        <div key={index} className="flex gap-3 border-b px-3.5 py-1.5 last:border-b-0 md:py-3">
          <BadgeCheck className="text-secondary" />
          <div className="flex-1 text-black md:space-y-2">
            <p className="p-text-16 leading-4 font-semibold md:leading-5">{benefit.heading}</p>
            <p className="p-text-14 leading-4 font-medium md:leading-5">{benefit.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PremiumBenefits;
