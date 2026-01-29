import Skeleton from "@/app/ui/Skeleton";

export default function HomeLoading() {
    return (
        <div className="w-full">
            {/* Services Carousel Skeleton */}
            <div className="mb-6">
                <div className="flex gap-4 overflow-hidden pb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="min-w-[200px] flex flex-col gap-2">
                            <Skeleton height={120} className="rounded-xl" />
                            <Skeleton height={20} width="80%" />
                            <Skeleton height={16} width="60%" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Section Skeleton */}
            <div className="mt-6">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <Skeleton height={32} width={200} />
                    <Skeleton height={40} width={120} className="rounded-xl" />
                </div>

                {/* Active Filters Skeleton */}
                <div className="mb-6">
                    <Skeleton height={48} className="rounded-xl" />
                </div>

                {/* Service Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <Skeleton height={200} className="rounded-xl" />
                            <div className="flex items-center gap-3">
                                <Skeleton variant="circular" width={48} height={48} />
                                <div className="flex-1">
                                    <Skeleton height={20} width="70%" className="mb-2" />
                                    <Skeleton height={16} width="50%" />
                                </div>
                            </div>
                            <Skeleton height={16} width="40%" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
