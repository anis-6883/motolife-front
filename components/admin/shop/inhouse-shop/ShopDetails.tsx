"use client";

import VacationModeModal from "@/app/(private)/admin/inhouse-shop/edit/VacationMoodEditForm";
import Modal from "@/components/ui/MtModal";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { ShopInfo as ShopInfoType, ShopStats } from "@/types/shop";
import { Edit2Icon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TbBeach } from "react-icons/tb";
import ShopBanner from "./ShopBanner";
import ShopInfo from "./ShopInfo";

interface ShopDetailsProps {
  shop: ShopInfoType;
  stats: ShopStats | null;
}

export default function ShopDetails({ shop, stats }: ShopDetailsProps) {
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);

  const vacation = shop?.businessSettings?.vacation;
  const isOnVacation = vacation?.isOnVacation ?? false;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* ── Header Row ── */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Shop Details</h3>
          <p className="mt-0.5 text-xs text-gray-500">Basic information about this shop for your quick review</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsVacationModalOpen(true)}
            variant={isOnVacation ? "default" : "outline"}
            className={`px-4 ${isOnVacation ? "border-amber-500 bg-amber-500 text-white hover:bg-amber-600" : ""}`}
          >
            <TbBeach />
            {isOnVacation ? "On Vacation" : "Go on Vacation"}
          </Button>

          <Link href={routes.privateRoutes.admin.inhouseShopEdit ?? "#"}>
            <Button>
              <Edit2Icon />
              Edit Information
            </Button>
          </Link>
        </div>
      </div>

      {isOnVacation ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="text-xs leading-relaxed font-semibold text-amber-700">
              🌴 Your shop is currently on vacation. Customers can view but cannot place orders.
            </p>
            {vacation?.endsAt && (
              <p className="mt-0.5 text-xs text-amber-600">
                Vacation ends: <span className="font-medium">{new Date(vacation.endsAt).toLocaleString()}</span>
              </p>
            )}
            {vacation?.note && <p className="mt-0.5 text-xs text-amber-600 italic">"{vacation.note}"</p>}
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#FFF5DC] px-4 py-2.5">
          <InfoIcon className="h-4 w-4" />
          <p className="text-xs">
            Your shop is now on live status. All functions are working properly. To turn vacation mode click{" "}
            <span className="font-semibold">Go vacation mode Button</span>
          </p>
        </div>
      )}

      {/* ── Banner ── */}
      <ShopBanner shop={shop} />

      {/* ── Shop Info  Stats ── */}
      <div className="mt-4">
        <ShopInfo shop={shop} stats={stats} />
      </div>

      {/* ── Vacation Modal ── */}
      <Modal
        open={isVacationModalOpen}
        onClose={() => setIsVacationModalOpen(false)}
        title="Vacation Mode Setup"
        description="If you turn on, your shop will go to vacation mode. Customer can view your shop but can not order to you."
        maxWidth={800}
      >
        <VacationModeModal
          open={isVacationModalOpen}
          onClose={() => setIsVacationModalOpen(false)}
          currentVacation={vacation}
          onSuccess={() => setIsVacationModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
