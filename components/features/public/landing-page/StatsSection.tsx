"use client";
import { Icons } from "@/components/icons";
import { Container } from "@/components/ui/container";

// Define the type for each stat in statsAry.
interface Stat {
  title: string;
  description: string;
  icon: keyof typeof Icons; // Ensures icon is one of the keys in Icons
}

const StatsSection = () => {
  const statsAry: Stat[] = [
    {
      title: "Reliable Shopping",
      description: "Safe and worry‑free shopping from home",
      icon: "reliableShopping",
    },
    {
      title: "Secure Payment",
      description: "Payments are always safe and protected",
      icon: "securePayment",
    },
    {
      title: "Customer Support",
      description: "24/7 premium support, just for you",
      icon: "customerSupport",
    },
    {
      title: "Nationwide Delivery",
      description: "Fast and reliable delivery across the country",
      icon: "deliveryTruck",
    },
    {
      title: "Easy Return",
      description: "Hassle-Free Returns Within 14 Days",
      icon: "easyReturn",
    },
  ];

  return (
    <div className="gap100 max-md:hidden">
      <div className="border-t">
        <Container className="justify-evenly space-y-3 py-6 max-lg:flex-wrap md:flex">
          {statsAry.map((stat, index) => {
            // Dynamically access the icon component from the Icons object
            const Icon = Icons[stat.icon as keyof typeof Icons];

            return (
              <div
                className="flex max-w-50.75 flex-col items-center justify-center gap-y-4 px-4 text-center first:border-l-0 first:pl-0 last:border-r-0 last:pr-0 max-md:border-b max-md:pb-2 max-md:last:border-b-0 max-md:last:pb-0 md:max-w-[40vw] lg:border-x xl:px-15"
                key={index}
              >
                <div className="text-primary flex size-12.5 items-center justify-center rounded-lg bg-[#F4F4F4]">
                  {/* Render the icon dynamically */}
                  <Icon className="size-7.5!" />
                </div>
                <div className="space-y-2">
                  <p className="p-text-18 font-dm-sans leading-[100%] font-semibold text-[#1A1A1A]">{stat.title}</p>
                  <p className="p-text-16 font-dm-sans leading-snug text-[#565553]">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </Container>
      </div>
    </div>
  );
};

export default StatsSection;
