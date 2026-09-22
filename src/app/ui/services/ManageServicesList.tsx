"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import Edit01Icon from "@hugeicons/core-free-icons/Edit01Icon";
import Delete01Icon from "@hugeicons/core-free-icons/Delete01Icon";
import { useDeleteService } from "@/hooks/useMarketplace";
import { formatNaira } from "@/lib/server/mappers";
import type { ServiceFeedItem } from "@/lib/server/queries";

interface ManageServicesListProps {
  services: ServiceFeedItem[];
}

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=BaroqueWorks";

export default function ManageServicesList({ services: initial }: ManageServicesListProps) {
  const [services, setServices] = useState(initial);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const deleteService = useDeleteService();

  const handleDelete = async (id: string) => {
    try {
      await deleteService.mutateAsync(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
      setConfirmId(null);
    } catch {
      // error surfaces via deleteService.error below
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My services</h1>
          <p className="text-gray-500 text-sm">{services.length} listed</p>
        </div>
        <Link
          href="/dashboard/services/create"
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
          New service
        </Link>
      </div>

      {deleteService.error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {deleteService.error.message}
        </div>
      )}

      {services.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">No services yet</h3>
          <p className="text-sm text-gray-400 mb-6">List your first service so clients can book you.</p>
          <Link
            href="/dashboard/services/create"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
          >
            Create a service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => {
            const id = service._id ?? "";
            const isConfirming = confirmId === id;
            return (
              <div key={id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-5">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={service.handyman?.image?.[0]?.url || FALLBACK_IMAGE}
                    alt={service.description ?? "Service"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{service.description ?? "Service"}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {formatNaira(service.price ?? 0)}
                    <span className="ml-2 text-xs capitalize">{service.pricingModel ?? "fixed"}</span>
                  </p>
                  {!isConfirming ? (
                    <div className="flex gap-4 mt-3">
                      <Link
                        href={`/dashboard/services/${id}/edit`}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirmId(id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={14} />
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50"
                      >
                        Keep
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deleteService.isPending}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleteService.isPending ? "Deleting…" : "Confirm delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
