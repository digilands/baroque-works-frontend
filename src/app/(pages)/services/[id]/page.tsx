'use client';
import React, { useState, useEffect } from 'react';
import { useParams, notFound } from "next/navigation";
import { handymen } from "@/utils/data";
import ServiceGallery from "@/app/ui/ServiceGallery";
import HandymanProfile from "@/app/ui/HandymanProfile";
import AboutHandyman from "@/app/ui/AboutHandyman";
import ReviewSection from "@/app/ui/ReviewSection";
import LocationMap from "@/app/ui/LocationMap";
import BookingSidebar from "@/app/ui/BookingSidebar";
import ScheduleModal from "@/app/ui/modals/ScheduleModal";
import ConfirmModal from "@/app/ui/modals/ConfirmModal";
import PaymentModal from "@/app/ui/modals/PaymentModal";
import { BookingData } from "@/app/ui/modals/ScheduleModal";

export default function ServiceDetailsPage() {
    const params = useParams();
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
        setHandyman(foundHandyman || null);
        setLoading(false);
    }, [id]);

    // Show loading state
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
        // Show success message or redirect
        alert('Booking successful! 🎉');
        // Reset states
        setBookingData(null);
    };

    const handleServiceSelect = (index: number) => {
        setSelectedService(index);
    };

    return (
        <div className="max-w-screen-xl mx-auto pb-10 px-4 md:px-8 mt-6">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Main Content */}
                <div className="flex-1">
                    <ServiceGallery images={[handyman.image, ...(profile.previousWork || [])]} />

                    <div className="flex flex-col gap-8">
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
                <div className="lg:w-[22rem]">
                    <div className="sticky top-24">
                        <BookingSidebar
                            handymanName={profile.name}
                            services={offeredServices || []}
                            onBookService={handleBookService}
                            selectedServiceIndex={selectedService}
                            onServiceSelect={handleServiceSelect}
                        />
                    </div>
                </div>
            </div>

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
