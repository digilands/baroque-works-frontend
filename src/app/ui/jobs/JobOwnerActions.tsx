"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import Edit01Icon from "@hugeicons/core-free-icons/Edit01Icon";
import Delete01Icon from "@hugeicons/core-free-icons/Delete01Icon";
import UserAdd01Icon from "@hugeicons/core-free-icons/UserAdd01Icon";
import { useDeleteJob } from "@/hooks/useMarketplace";

interface JobOwnerActionsProps {
  jobId: string;
}

/** Owner management bar on own job postings: edit, cancel, hire a pro. */
export default function JobOwnerActions({ jobId }: JobOwnerActionsProps) {
  const router = useRouter();
  const deleteJob = useDeleteJob();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteJob.mutateAsync(jobId);
      router.push("/dashboard/jobs");
    } catch {
      setConfirming(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8 mb-10">
      {deleteJob.error && (
        <p className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {deleteJob.error.message}
        </p>
      )}
      {!confirming ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/search?tab=pros&hireFor=${jobId}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all"
          >
            <HugeiconsIcon icon={UserAdd01Icon} size={16} />
            Hire a pro
          </Link>
          <Link
            href={`/dashboard/jobs/${jobId}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all"
          >
            <HugeiconsIcon icon={Edit01Icon} size={16} />
            Edit job
          </Link>
          <button
            onClick={() => setConfirming(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-all"
          >
            <HugeiconsIcon icon={Delete01Icon} size={16} />
            Cancel job
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <p className="flex-1 text-sm font-medium text-gray-600">
            Cancel this job posting? This cannot be undone.
          </p>
          <button
            onClick={() => setConfirming(false)}
            className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold hover:bg-gray-50"
          >
            Keep
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteJob.isPending}
            className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50"
          >
            {deleteJob.isPending ? "Cancelling…" : "Confirm cancel"}
          </button>
        </div>
      )}
    </div>
  );
}
