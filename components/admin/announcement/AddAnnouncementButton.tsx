"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AnnouncementModal from "./AnnouncementModal";

export default function AddAnnouncementButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="cool" onClick={() => setIsModalOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Add New Announcement
      </Button>
      {isModalOpen && <AnnouncementModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
