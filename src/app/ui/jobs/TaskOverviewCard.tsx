import { ClipboardList, Image as ImageIcon, FileText } from "lucide-react";

interface TaskOverviewCardProps {
  description: string;
  photos: string[];
  instructions?: string;
}

export function TaskOverviewCard({ description, photos, instructions }: TaskOverviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">Task Overview</h3>
      </div>

      <div className="mb-8">
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>

      {instructions && (
        <div className="mb-8 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100/50">
           <div className="flex items-center gap-2 mb-2">
             <FileText className="w-4 h-4 text-yellow-600" />
             <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Special Instructions</p>
           </div>
           <p className="text-sm text-gray-700 italic pl-6 border-l-2 border-yellow-200">"{instructions}"</p>
        </div>
      )}

      {photos.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-4">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            Workspace Photos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {photos.map((photo, index) => (
               <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 relative group cursor-pointer">
                 <img 
                   src={photo} 
                   alt={`Workspace ${index + 1}`} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
