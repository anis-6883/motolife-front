"use client";

import { getActivityLog } from "@/actions/activity-log/activity-log-actions";
import PaginationDataTable from "@/components/shared/PaginationDataTable";
import { formatLogDate, formatTime } from "@/lib/client-utils";
import { IOrderActivityLog } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

function ActivityLogs({ resourceType, resourceId }: { resourceType: string; resourceId: string }) {
  const [logs, setLogs] = useState<IOrderActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setIsLoading(true);

      const res = await getActivityLog(resourceType, resourceId);

      if (res?.data) {
        setLogs(res.data.docs || []);
        setTotal(res.data.pagination?.totalDocs || 0);
      }

      setIsLoading(false);
    }

    fetchLogs();
  }, [resourceId]);

  const columns: ColumnDef<IOrderActivityLog>[] = [
    {
      id: "activity",
      header: "Activity",
      cell: ({ row }) => {
        const log = row.original;

        return (
          <div className="relative flex items-center gap-2 pb-5 lg:gap-10 2xl:gap-15">
            <div className="p-text-16 text-dark-gray w-8 shrink-0 pt-1 font-semibold sm:w-12">{formatTime(log.createdAt)}</div>

            <div className="flex flex-1 items-center gap-2.5 lg:gap-5">
              <div className="bg-light-gray/20 z-10 flex size-10 items-center justify-center rounded-full border-2">
                <Check className="text-dark-gray size-6" />
              </div>

              <div>
                <p className="p-text-16 font-semibold">{log.title}</p>

                <p className="p-text-14 text-dark-gray mt-0.5">
                  by{" "}
                  <span className="text-black">
                    {log.user.name}, {log.user.role}
                  </span>
                </p>

                <span className="p-text-14 text-light-gray shrink-0 sm:hidden">{formatLogDate(log.createdAt)}</span>
              </div>
            </div>

            <span className="p-text-14 text-light-gray shrink-0 max-sm:hidden">{formatLogDate(log.createdAt)}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6">
      <h3 className="p-text-20 mb-4 border-b pb-2.5 font-semibold">Activity Log</h3>

      <PaginationDataTable data={logs} columns={columns} searchable={false} pagination={true} total={total} isLoading={isLoading} />
    </div>
  );
}

export default ActivityLogs;
