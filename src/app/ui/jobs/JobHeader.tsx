import { ChevronLeft, Bell, MoreVertical } from "lucide-react";
import Link from "next/link";

interface JobHeaderProps {
  title: string;
  requestId: string;
}

export function JobHeader({ title, requestId }: JobHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/jobs" className="hover:text-gray-900 transition-colors">
          Jobs
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
        <span className="text-gray-900 font-medium">Request #{requestId}</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          <p className="text-gray-500 mt-1">Review the details below before accepting.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
