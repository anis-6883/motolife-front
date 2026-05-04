import ContactForm from "@/components/features/public/contact/ContactForm";
import BreadCrumbSection from "@/components/features/public/shared/BreadCrumbSection";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { allRoutes } from "@/config/constant";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Ellipsis } from "lucide-react";
import { Metadata } from "next";
export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.CONTACT_US);

const page = () => {
  const contactAry = [
    {
      icon: "MapPin",
      title: "Our Address",
      description: "Bangshal, Dhaka, Bangladesh",
    },
    {
      icon: "Phone",
      title: "Call Us",
      description: "+880 1234 567890",
    },
    {
      icon: "Mail",
      title: "Email Us",
      description: "contact.motolife@gmail.com",
    },
    {
      icon: "Support",
      title: "Support Hours",
      description: "10 AM to 8 PM",
    },
  ];
  return (
    <>
      <BreadCrumbSection
        options={[
          { slug: "/", name: "Home" },
          { slug: allRoutes.contact, name: "Contact" },
        ]}
      />
      <Container className="bg-white pt-5">
        <h1 className="p-text-36 text-center leading-8 font-bold -tracking-[0.72px] capitalize md:leading-12">Contact Us</h1>
        <div className="flex gap-6.5 max-lg:flex-col max-md:space-y-5 md:px-16 md:py-8 lg:px-0 xl:py-10 2xl:px-25">
          <div className="flex-1 space-y-3 md:space-y-6">
            <div className="grid h-max grid-cols-1 gap-3 md:gap-3.5 [@media(min-width:375px)]:grid-cols-2">
              {contactAry.map((contactObj, index) => {
                const Icon = Icons[contactObj.icon as keyof typeof Icons];
                return (
                  <div
                    className="flex flex-col items-center justify-center rounded-lg bg-[#F4F4F4] text-center text-black [@media(max-width:375px)]:py-6 [@media(min-width:375px)]:aspect-square"
                    key={index}
                  >
                    <Icon className="text-primary" />
                    <p className="p-text-18 pt-3 pb-2 font-semibold md:pt-6 md:pb-3.5">{contactObj.title}</p>
                    <Ellipsis className="size-7 text-[#D9D9D9]" />
                    <p className="p-text-14 font-medium md:leading-5">{contactObj.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="">
              <p className="p-text-15 text-light-gray mb-4 font-semibold uppercase">Follow us on</p>

              <div className="flex gap-3">
                <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                  <Icons.FacebookIconSolid className="size-7.5!" />
                </Button>
                <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                  <Icons.InstagramSolid className="size-7.5!" />
                </Button>
                <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                  <Icons.WhatsappSolid className="size-7.5!" />
                </Button>
                <Button variant="link" size="icon" className="size-10! rounded-md border bg-transparent no-underline hover:no-underline">
                  <Icons.TwitterSolid className="size-7.5!" />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full rounded-lg border bg-white p-3 shadow-xs max-lg:order-first max-lg:mx-auto md:p-5 lg:max-w-100 xl:max-w-170 xl:p-10 2xl:max-w-180">
            <h3 className="p-text-24 mb-4 font-semibold text-black md:mb-8 lg:mb-10">
              We are here to help with your orders, products and account related questions
            </h3>
            <ContactForm />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.746442488735!2d90.35494477613089!3d23.756419678666322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b962e5ab5c5b%3A0xa84024bfe706910c!2sMoto%20Life%20Bangladesh!5e0!3m2!1sen!2sbd!4v1770014713783!5m2!1sen!2sbd"
            width="100%"
            height="320"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>
      </Container>
    </>
  );
};

export default page;
