"use client";

import { cn } from "@/lib/utils";
import createDOMPurify from "dompurify";
import { ElementType, useMemo } from "react";

type Props = {
  htmlString: string;
  className?: string;
  as?: ElementType;
};

const SanitizedContent = ({ htmlString, className, as: Tag = "div" }: Props) => {
  const sanitizedHtml = useMemo(() => {
    if (typeof window === "undefined") return "";
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(htmlString || "");
  }, [htmlString]);

  return <Tag className={cn(className)} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SanitizedContent;
