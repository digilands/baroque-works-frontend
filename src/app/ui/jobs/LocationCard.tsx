import { MapPin, Phone, Shield } from "lucide-react";
import { JobLocation } from "@/types/job";

interface LocationCardProps {
  location: JobLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">Location</h3>
      </div>

      <div className="aspect-video w-full bg-gray-100 rounded-xl mb-6 relative overflow-hidden group border border-gray-100">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
          <MapPin className="w-8 h-8 opacity-20" />
        </div>
        {/* Placeholder for actual map implementation */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm border border-gray-200">
          {location.distance} away
        </div>
      </div>

      <div className="space-y-6">
        <div>
           <p className="text-base font-medium text-gray-900">{location.address}</p>
           <p className="text-sm text-gray-500 mt-1">{location.city}, {location.state}</p>
        </div>
        
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50/50">
           <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
             <Phone className="w-4 h-4 text-gray-600" />
           </div>
           <div>
             <p className="text-sm font-medium text-gray-900">Contact Hidden</p>
             <p className="text-xs text-gray-500">Visible after acceptance</p>
           </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-gray-500 bg-blue-50/50 p-3 rounded-xl">
             <Shield className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
             <p>Exact location shared only after job acceptance for security purposes.</p>
        </div>
      </div>
    </div>
  );
}
