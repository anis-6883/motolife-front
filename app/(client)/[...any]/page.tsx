import { notFound } from "next/navigation";

const page = () => {
  notFound();
  //throw new Error("Not Found");
};

export default page;
