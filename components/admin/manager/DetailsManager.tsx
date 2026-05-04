import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import { Manager } from "./type";

interface DetailsManagerProps {
  manager: Manager;
}

export default function DetailsManager({ manager }: DetailsManagerProps) {
  const shortId = manager._id.slice(-8).toUpperCase();

  return (
    <div className="w-full">
      <div className="rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
            {manager.image ? (
              <Image src={manager.image} alt={manager.name} width={56} height={56} className="h-full w-full object-cover" />
            ) : (
              <UserCircle2 className="h-full w-full p-1 text-gray-400" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-xs text-gray-400">Manager ID: {shortId}</p>
            <h3 className="text-lg font-semibold text-gray-800">{manager.name}</h3>
            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {manager.role?.name ?? "—"}
            </span>
          </div>

          {/* Status badge */}
          <span
            className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              manager.status ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}
          >
            {manager.status ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="my-4 border-t border-gray-100" />

        {/* Personal Information */}
        <div>
          <p className="mb-3 text-xs font-medium tracking-wide text-gray-400 uppercase">Personal Information</p>

          <div className="space-y-2.5 text-sm">
            <div className="flex">
              <span className="w-20 text-gray-500">Phone</span>
              <span className="text-gray-800">: {manager.phone ?? "—"}</span>
            </div>

            <div className="flex">
              <span className="w-20 text-gray-500">Email</span>
              <span className="text-gray-800">: {manager.email}</span>
            </div>

            {manager.identifyType && (
              <div className="flex">
                <span className="w-20 text-gray-500">{manager.identifyType === "nid" ? "NID" : "Passport"}</span>
                <span className="text-gray-800">: {manager.identifyNumber ?? "—"}</span>
                {manager.identifyImage && (
                  <a
                    href={manager.identifyImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-blue-500 hover:underline"
                  >
                    View image
                  </a>
                )}
              </div>
            )}

            <div className="flex">
              <span className="w-20 text-gray-500">Joined</span>
              <span className="text-gray-800">
                :{" "}
                {manager.createdAt
                  ? new Date(manager.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
