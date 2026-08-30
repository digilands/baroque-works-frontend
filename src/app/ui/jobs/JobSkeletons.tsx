export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full animate-pulse">
      <div className="h-6 w-32 bg-gray-100 rounded-lg mb-6" />
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
       <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
       <div className="flex justify-between items-start">
         <div className="space-y-3">
           <div className="h-8 w-64 bg-gray-100 rounded-lg" />
           <div className="h-4 w-48 bg-gray-100 rounded" />
         </div>
         <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-100 rounded-lg" />
            <div className="h-10 w-10 bg-gray-100 rounded-lg" />
         </div>
       </div>
    </div>
  );
}

export function JobPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-10">
      <HeaderSkeleton />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <CardSkeleton />
           <CardSkeleton />
        </div>
        <div className="space-y-6">
           <CardSkeleton />
           <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
