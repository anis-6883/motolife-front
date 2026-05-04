import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import RichTextPageHeader from "@/components/shared/RichTextPageHeader";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.HOW_TO_SELL);
const page = () => {
  const TermsConditionsData = {
    brief:
      "Welcome to Motolife. By accessing or using our website and services you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using the platform",
    points: [
      {
        title: "Use of the Platform",
        description:
          "Motolife provides an online marketplace for buying and selling motor parts accessories and related products. You agree to use the platform only for lawful purposes and in accordance with these terms.",
      },
      {
        title: "User Accounts",
        description:
          "To access certain features you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities carried out under your account. Motolife reserves the right to suspend or terminate accounts that violate these terms or engage in suspicious or harmful activities.",
      },
      {
        title: "Orders and Payments",
        description:
          "All orders placed through the platform are subject to acceptance and availability. Prices product details and availability may change at any time without prior notice. Payments must be made using the available payment methods during checkout. Motolife may contact customers to confirm orders before processing.",
      },
      {
        title: "Shipping and Delivery",
        description:
          "Delivery timelines and shipping charges depend on the selected delivery option and location. Estimated delivery times are provided for reference and may vary due to external factors. Motolife is not responsible for delays caused by courier services or unforeseen circumstances.",
      },
      {
        title: "Returns and Refunds",
        description:
          "Returns and refunds are governed by our Return and Refund Policy. Eligibility timelines and conditions vary by product category. Motolife reserves the right to approve or reject refund requests based on policy compliance and verification.",
      },
      {
        title: "Seller Responsibilities",
        description:
          "Sellers are responsible for ensuring accurate product information pricing and stock availability. Products must comply with applicable laws and quality standards. Motolife may take action against sellers for policy violations including suspension or removal from the platform.",
      },
      {
        title: "Intellectual Property",
        description:
          "All content on Motolife including logos designs text and images are the property of Motolife or its content partners. Unauthorized use reproduction or distribution is prohibited.",
      },
      {
        title: "Limitation of Liability",
        description:
          "Motolife is not liable for indirect incidental or consequential damages arising from the use of the platform. Use of the website and services is at your own risk.",
      },
      {
        title: "Changes to Terms",
        description:
          "Motolife may update these Terms and Conditions from time to time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms.",
      },
      {
        title: "Contact Information",
        description:
          "For questions or concerns regarding these Terms and Conditions please contact our support team through the Help and Support section.",
      },
    ],
  };
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.howToSell, name: "How to Sell" },
        ]}
      />
      <Container className="bg-white pt-5">
        <RichTextPageHeader header="How to Sell" />

        <div className="space-y-4 rounded-lg border p-3 shadow-xl md:space-y-7.5 md:p-5 lg:p-10">
          <p className="p-text-18 max-lg:text-justify">{TermsConditionsData.brief}</p>
          {TermsConditionsData.points.map((obj, index) => (
            <div className="space-y-4" key={index}>
              <h2 className="p-text-24 font-semibold -tracking-[0.24px]">
                {index + 1}. {obj.title}
              </h2>
              <p className="p-text-18 max-lg:text-justify">{obj.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default page;
