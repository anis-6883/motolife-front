"use client";

import Modal from "@/components/ui/MtModal";
import { useState } from "react";
import DetailsManager from "../DetailsManager";
import { Manager, ManagerPagination } from "../type";
import ManagerTable from "./ManagerTable";

interface ManagerListClientProps {
  docs: Manager[];
  pagination: ManagerPagination;
}

export default function ManagerListClient({ docs, pagination }: ManagerListClientProps) {
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  return (
    <>
      <ManagerTable docs={docs} pagination={pagination} onView={(manager) => setSelectedManager(manager)} />
      <Modal maxWidth={650} open={Boolean(selectedManager)} onClose={() => setSelectedManager(null)} title="Manager Details">
        {selectedManager && <DetailsManager manager={selectedManager} />}
      </Modal>
    </>
  );
}
