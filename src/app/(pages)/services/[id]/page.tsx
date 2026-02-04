"use client";

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from "next/navigation";
import { handymen } from "@/utils/data";
import ServiceGallery from "@/app/ui/ServiceGallery";
import HandymanProfile from "@/app/ui/HandymanProfile";
import AboutHandyman from "@/app/ui/AboutHandyman";
import ReviewSection from "@/app/ui/ReviewSection";
import LocationMap from "@/app/ui/LocationMap";
import BookingSidebar from "@/app/ui/BookingSidebar";
import ScheduleModal, { BookingData } from "@/app/ui/modals/ScheduleModal";
import ConfirmModal from "@/app/ui/modals/ConfirmModal";
import PaymentModal from "@/app/ui/modals/PaymentModal";
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading01Icon, ArrowLeft01Icon, Share01Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import { useRouter } from "next/navigation";

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [handyman, setHandyman] = useState<typeof handymen[0] | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [selectedService, setSelectedService] = useState<number>(0);

    useEffect(() => {
        const foundHandyman = handymen.find((h) => h.id === parseInt(id));
        
        // Artificial delay for premium feel loading
        const timer = setTimeout(() => {
            setHandyman(foundHandyman || null);
            setLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-gray-50 rounded-full" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <HugeiconsIcon icon={Loading01Icon} size={32} className="text-indigo-600 animate-spin" />
                   </div>
                </div>
                <p className="mt-6 text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                   Curating Details...
                </p>
            </div>
        );
    }

    if (!handyman) {
        notFound();
    }

    const { profile, offeredServices } = handyman;

    // Booking flow handlers
    const handleBookService = () => {
        setScheduleModalOpen(true);
    };

    const handleScheduleConfirm = (data: BookingData) => {
        setBookingData(data);
        setScheduleModalOpen(false);
        setConfirmModalOpen(true);
    };

    const handleConfirmProceed = () => {
        setConfirmModalOpen(false);
        setPaymentModalOpen(true);
    };

    const handlePaymentComplete = () => {
        setPaymentModalOpen(false);
        alert('Booking successful! 🎉 Your pro will be notified.');
        setBookingData(null);
    };

    const handleServiceSelect = (index: number) => {
        setSelectedService(index);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group">
                   <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="group-hover:-translate-x-1 transition-transform" />
                   Back to Home
                </button>
                <div className="flex items-center gap-3">
                   <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                     <HugeiconsIcon icon={Share01Icon} size={18} />
                   </button>
                   <button className="p-2.5 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all">
                     <HugeiconsIcon icon={FavouriteIcon} size={18} />
                   </button>
                </div>
              </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Main Content */}
                    <div className="flex-1 min-w-0">
                        <ServiceGallery images={[handyman.image, ...(profile.previousWork || [])]} />

                        <div className="space-y-12 mt-12">
                            <HandymanProfile
                                image={profile.profilePic}
                                name={profile.name}
                                rating={profile.rating}
                                reviews={profile.reviews || 0}
                            />

                            <AboutHandyman
                                aboutMe={profile.aboutMe || "No description provided."}
                                experience={profile.experience || "0 years"}
                                previousWork={profile.previousWork || []}
                                category={handyman.subcategory || handyman.category}
                            />

                            <ReviewSection
                                rating={profile.rating}
                                count={profile.reviews || 0}
                                review={profile.reviewsList?.[0] || null}
                            />

                            <LocationMap address={profile.location || "Abuja, Nigeria"} />
                        </div>
                    </div>

                    {/* Right Column - Booking Sidebar */}
                    <aside className="lg:w-[24rem]">
                        <div className="sticky top-28">
                            <BookingSidebar
                                handymanName={profile.name}
                                services={offeredServices || []}
                                onBookService={handleBookService}
                                selectedServiceIndex={selectedService}
                                onServiceSelect={handleServiceSelect}
                            />
                        </div>
                    </aside>
                </div>
            </main>

            {/* Modals */}
            <ScheduleModal
                open={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                onConfirm={handleScheduleConfirm}
                services={offeredServices || []}
                handymanName={profile.name}
            />

            <ConfirmModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmProceed}
                onGoBack={() => {
                    setConfirmModalOpen(false);
                    setScheduleModalOpen(true);
                }}
                bookingData={bookingData}
                handymanName={profile.name}
                handymanImage={profile.profilePic}
                location={profile.location || "Abuja, Nigeria"}
            />

            <PaymentModal
                open={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handlePaymentComplete}
                onGoBack={() => {
                    setPaymentModalOpen(false);
                    setConfirmModalOpen(true);
                }}
                amount={bookingData?.price || 30}
            />
        </div>
    );
}
