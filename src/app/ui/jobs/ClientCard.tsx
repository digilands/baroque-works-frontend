import { Star, MessageSquare, BadgeCheck, Home } from "lucide-react";
import { Client } from "@/types/job";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Client</h3>
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </button>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
          {client.avatarUrl.length <= 2 ? client.avatarUrl : <img src={client.avatarUrl} alt={client.name} className="w-full h-full rounded-full object-cover" />}
        </div>
        <div>
          <p className="font-medium text-gray-900">{client.name}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="font-semibold text-gray-900">{client.rating}</span>
            <span>({client.totalJobs} jobs)</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {client.isVerified && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BadgeCheck className="w-4 h-4 text-gray-400" />
            <span>Identity Verified</span>
          </div>
        )}
        {client.isRepeatClient && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4 text-gray-400" />
            <span>Repeat Client</span>
          </div>
        )}
      </div>
    </div>
  );
}
