import Skeleton from "@/app/ui/Skeleton";

export default function ServiceDetailsLoading() {
    return (
        <div className="max-w-screen-xl mx-auto pb-10 px-4 md:px-8 mt-6">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Main Content */}
                <div className="flex-1">
                    {/* Gallery Skeleton */}
                    <div className="mb-8">
                        <Skeleton height={400} className="rounded-2xl mb-4" />
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} height={80} className="flex-1 rounded-xl" />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Profile Skeleton */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-6 bg-[var(--color-white-bg)] rounded-[1.25rem] border border-[#EDEDED] dark:border-gray-700">
                            <div className="flex items-center gap-5">
                                <Skeleton variant="circular" width={64} height={64} />
                                <div>
                                    <Skeleton height={24} width={150} className="mb-2" />
                                    <Skeleton height={16} width={120} />
                                </div>
                            </div>
                            <Skeleton height={40} width={150} className="rounded-2xl mt-4 md:mt-0" />
                        </div>

                        {/* About Handyman Skeleton */}
                        <div className="flex flex-col gap-6">
                            <Skeleton height={24} width={180} />
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <div className="flex-1">
                                        <Skeleton height={18} width={120} className="mb-2" />
                                        <Skeleton height={14} width="80%" />
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <div className="flex-1">
                                        <Skeleton height={18} width={100} className="mb-2" />
                                        <Skeleton height={14} width="90%" className="mb-1" />
                                        <Skeleton height={14} width="85%" />
                                    </div>
                                </div>
                            </div>

                            {/* Previous Work Gallery Skeleton */}
                            <div>
                                <Skeleton height={24} width={150} className="mb-3" />
                                <Skeleton height={40} width="100%" className="rounded-lg mb-3" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} height={128} className="rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Review Section Skeleton */}
                        <div className="w-full mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <Skeleton height={20} width={150} />
                                <Skeleton height={20} width={120} />
                            </div>
                            <Skeleton height={120} className="rounded-[1.25rem]" />
                        </div>

                        {/* Location Map Skeleton */}
                        <Skeleton height={200} className="rounded-2xl" />
                    </div>
                </div>

                {/* Right Column - Booking Sidebar Skeleton */}
                <div className="lg:w-[22rem]">
                    <div className="sticky top-24">
                        <div className="flex flex-col gap-8">
                            {/* Services List Skeleton */}
                            <div>
                                <Skeleton height={20} width={180} className="mb-4" />
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="min-w-[9rem] flex flex-col gap-2.5">
                                            <Skeleton height={104} className="rounded-xl" />
                                            <Skeleton height={16} width="80%" />
                                            <Skeleton height={14} width="60%" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Service Card Skeleton */}
                            <div className="bg-[var(--color-white-bg)] p-1 rounded-2xl">
                                <Skeleton height={20} width={150} className="mb-3" />
                                <Skeleton height={160} className="rounded-[1rem] mb-3" />
                                <Skeleton height={22} width="70%" className="mb-1" />
                                <Skeleton height={18} width="50%" />
                            </div>

                            {/* Hourly Charge Info Skeleton */}
                            <Skeleton height={80} className="rounded-xl" />

                            {/* Total & Action Skeleton */}
                            <div className="pt-2">
                                <Skeleton height={32} width={150} className="mb-4" />
                                <Skeleton height={56} className="rounded-[1rem]" />
                                <Skeleton height={14} width="100%" className="mt-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
