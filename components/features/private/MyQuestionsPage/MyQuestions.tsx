"use client";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { qaData } from "@/lib/product-data";
import { useState } from "react";
import { EditAddQAModal } from "../../public/product-detail/EditQAModal";
import { DeleteConfirmModal } from "../../public/shared/DeleteConfirmationModal";
import { PaginationSection } from "../../public/shared/PaginationSection";

const MyQuestions = () => {
  const [selectedQA, setSelectedQA] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = qaData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedQA = qaData.slice(startIndex, endIndex);
  return (
    <div>
      <h2 className="p-text-24 mb-4 font-semibold md:mb-8">My Questions</h2>
      <div className="space-y-3 md:space-y-5">
        {paginatedQA.map((item, index) => (
          <div key={index} className="space-y-3 rounded-lg border p-2 md:space-y-5 md:p-3.5">
            <div className="flex gap-2.5">
              <div className="relative aspect-square size-12 rounded-lg">
                <ImageWithFallback fallbackSrc={"/images/auth/logo.png"} src={item.product.image} fill alt={item.product.name} />
              </div>
              <div className="text-dark-gray flex-1 space-y-2">
                <p className="p-text-16 leading-5 font-semibold">{item.product.name}</p>
                <p className="p-text-16 leading-5">{item.product.price} BDT</p>
              </div>
            </div>
            {/* <QAItemSection
              {...item}
              onEdit={() => {
                setSelectedQA(item);
                setEditOpen(true);
              }}
              onDelete={() => {
                setSelectedQA(item);
                setDeleteOpen(true);
              }}
            /> */}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pt-6 md:pt-10">
          <PaginationSection
            hideleftPortion={true}
            currentPage={currentPage}
            totalItems={totalItems}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)))}
          />
        </div>
      )}
      <EditAddQAModal open={editOpen} qa={selectedQA} onClose={() => setEditOpen(false)} />

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
};

export default MyQuestions;
