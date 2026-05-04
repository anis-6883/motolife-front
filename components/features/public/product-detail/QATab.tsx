"use client";
import { Button } from "@/components/ui/button";
import formatDateToDateString from "@/lib/client-utils";
import useUserProfile from "@/store/useUserProfile";
import { useState } from "react";
import { DeleteConfirmModal } from "../shared/DeleteConfirmationModal";
import { PaginationSection } from "../shared/PaginationSection";
import { EditAddQAModal } from "./EditQAModal";
import { IFaq } from "./schemas";

interface QAItemProps {
  name: string;
  date: string;
  question: string;
  answer: string;
}

export function QATab({
  faqs,
  isCombo,
  productId,
  setPage,
  currentPage,
  pagination,
  setRefetchFaqs,
  refetchFaqs,
}: {
  faqs: IFaq[];
  isCombo?: boolean;
  productId: string;
  setRefetchFaqs: (v: boolean) => void;
  refetchFaqs: boolean;
  setPage: (v: number) => void;
  currentPage: number;
  pagination: any;
}) {
  const [selectedQA, setSelectedQA] = useState<any>(null);
  const { userData } = useUserProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const ITEMS_PER_PAGE = 10;
  // const [currentPage, setCurrentPage] = useState(1);

  // const totalItems = faqs.length;
  // const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const endIndex = startIndex + ITEMS_PER_PAGE;

  // const paginatedQA = faqs.slice(startIndex, endIndex);

  return (
    <div className="space-y-1 md:space-y-8">
      <div className="flex items-center justify-between gap-y-2 pb-2 max-md:flex-col md:pb-4">
        <h3 className="p-text-24 leading-6 font-semibold text-black md:-tracking-[0.24px]">Questions & Answers</h3>{" "}
        <Button
          onClick={() => {
            setSelectedQA(null);
            setEditOpen(true);
          }}
          variant="outline"
          className="border-black uppercase max-md:w-full"
        >
          Ask a question
        </Button>
      </div>
      {faqs.map((item) => (
        <QAItemSection key={item._id} name={item.customerName} date={item.createdAt} question={item.question} answer={item.answer} />
      ))}
      {pagination?.totalPages > 1 && (
        <div className="pt-6 md:pt-10">
          <PaginationSection
            currentPage={currentPage}
            totalItems={pagination?.totalDocs}
            totalPages={pagination?.totalPages}
            startIndex={pagination?.pagingCounter}
            endIndex={pagination?.totalPages}
            onPageChange={(page) => setPage(Math.max(1, Math.min(pagination?.totalPages, page)))}
          />
        </div>
      )}
      <EditAddQAModal
        userInfo={userData}
        open={editOpen}
        qa={selectedQA}
        productId={productId}
        isComboProduct={isCombo}
        refetchFaqs={refetchFaqs}
        setRefetchFaqs={setRefetchFaqs}
        onClose={() => setEditOpen(false)}
        // onSubmit={(data: any) => {
        //   console.log("UPDATE QA:", data);
        //   setEditOpen(false);
        // }}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          console.log("DELETE QA:", selectedQA);
          setDeleteOpen(false);
        }}
        title="Delete Question"
        description="Are you sure you want to delete the question?"
        confirmText="Delete Question"
      />
    </div>
  );
}
export function QAItemSection({ name, date, question, answer }: QAItemProps) {
  return (
    <div className={`group relative rounded-lg border pb-1 md:pb-6`}>
      <div className="pl-3.5">
        {/* Header */}
        <div className="mb-3 flex justify-between"></div>

        {/* Content */}
        <div className="flex items-start justify-between gap-5">
          <div className="flex-1 md:space-y-3">
            {/* Question */}
            <div className="flex justify-between md:hidden">
              <p className="p-text-16 leading-6 text-[#777] max-md:w-full max-md:pr-3.5 max-md:text-right">
                {formatDateToDateString(date)}
              </p>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="xs" className="text-[#777] hover:text-black">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-32 rounded-none border-gray-100 shadow-xl">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-3 w-3" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={onDelete}>
                    <Trash2 className="mr-2 h-3 w-3" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-1 gap-2">
                <span className="text-dark-gray">Q:</span>
                <div className="p-text-16 leading-6 text-black">
                  <p className="">{question}</p>
                  <h4 className="p-text-14 text-dark-gray flex items-center gap-1">{name}</h4>
                </div>
              </div>
              {/* <p className="p-text-16 leading-6 text-[#777] max-md:hidden">{date}</p> */}
            </div>

            {/* Answer */}
            <div className="p-text-16 flex gap-4 leading-6 text-black">
              <div className="flex gap-2">
                <span className="text-dark-gray">A:</span>
                <p className=" ">{answer}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="!size-8 text-[#777] hover:text-black max-md:hidden">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32 rounded-none border-gray-100 shadow-xl">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={onDelete}>
                <Trash2 className="mr-2 h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  );
}
