"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { deletePolicy } from "@/actions/admin/settings-action";
import ActionButton from "@/components/shared/ActionButton";
import DeleteModal from "@/components/shared/DeleteModal";
import { Button } from "@/components/ui/button";
import EditPolicyModal from "./EditPolicyModal";

type Policy = {
  name: string;
  description: string;
  _id: string;
};

export default function PolicyManagementTable({ data }: { data: Policy[] }) {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [viewPolicy, setViewPolicy] = useState<Policy | null>(null);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
  const [addPolicyOpen, setAddPolicyOpen] = useState(false);
  const handleDelete = (policy: Policy) => {
    setPolicyToDelete(policy);
  };
  return (
    <div className="space-y-4">
      {" "}
      <Button size="sm" className="cool" onClick={() => setAddPolicyOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Add New Policy
      </Button>
      <div className="overflow-hidden rounded-xl border border-gray-300">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-left text-base font-semibold text-gray-800">
              <th className="px-4 py-3">SL</th>
              <th className="px-4 py-3">Policy Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.length ? (
              data.map((policy, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-text-16 px-4 py-3">{index + 1}</td>

                  <td className="p-text-16 px-4 py-3">{policy.name}</td>

                  <td className="p-text-16 my-3 line-clamp-2 max-w-[400px] overflow-hidden px-4">{policy.description}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ActionButton type="edit" tooltip="Edit" onClick={() => setSelectedPolicy(policy)} />
                      <ActionButton type="view" tooltip="View" onClick={() => setViewPolicy(policy)} />
                      <ActionButton type="delete" tooltip="Delete" onClick={() => handleDelete(policy)} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No policies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {addPolicyOpen && <EditPolicyModal open={addPolicyOpen} onClose={() => setAddPolicyOpen(false)} />}
      {selectedPolicy && <EditPolicyModal open={!!selectedPolicy} onClose={() => setSelectedPolicy(null)} defaultValues={selectedPolicy} />}
      {viewPolicy && <EditPolicyModal open={!!viewPolicy} onClose={() => setViewPolicy(null)} defaultValues={viewPolicy} viewOnly />}
      {policyToDelete ? (
        <DeleteModal
          isOpen={!!policyToDelete}
          title="Delete Policy Confirmation!"
          description={
            <span>
              Are you sure you want to delete this policy: <span className="text-primary font-semibold">"{policyToDelete?.name}"</span>?
            </span>
          }
          warningNote={"This action can't be undone"}
          onClose={() => setPolicyToDelete(null)}
          onDelete={async () => {
            await deletePolicy(policyToDelete?._id);
            return { success: true };
          }}
          deleteButtonText="Delete"
          loadingMessage="Deleting policy..."
          successMessage="Policy deleted successfully!"
          errorMessage="Failed to delete policy!"
        />
      ) : null}
    </div>
  );
}
