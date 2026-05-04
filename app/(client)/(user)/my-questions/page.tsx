import MyQuestions from "@/components/features/private/MyQuestionsPage/MyQuestions";
import { generatePageMetadata } from "@/lib/metadata";
import { PAGE_METADATA } from "@/lib/metadata-constants";
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(PAGE_METADATA.MY_QUESTIONS);

const page = () => {
  return (
    <div className="mx-auto rounded-lg border bg-white p-3 md:p-6">
      <MyQuestions />
    </div>
  );
};

export default page;
