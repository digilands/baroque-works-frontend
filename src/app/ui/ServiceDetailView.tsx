"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import ServiceGallery from "@/app/ui/ServiceGallery";
import HandymanProfile from "@/app/ui/HandymanProfile";
import AboutHandyman from "@/app/ui/AboutHandyman";
import ReviewSection from "@/app/ui/ReviewSection";
import LocationMap from "@/app/ui/LocationMap";
import BookingSidebar from "@/app/ui/BookingSidebar";
import type { BookingData } from "@/app/ui/modals/ScheduleModal";
import { HugeiconsIcon } from "@hugeicons/react";
import Loading01Icon from "@hugeicons/core-free-icons/Loading01Icon";
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";
import Share01Icon from "@hugeicons/core-free-icons/Share01Icon";
import FavouriteIcon from "@hugeicons/core-free-icons/FavouriteIcon";
import { useRouter } from "next/navigation";

// MUI Dialogs are heavy — split them out; they mount closed anyway.
const ScheduleModal = dynamic(() => import("@/app/ui/modals/ScheduleModal"), { ssr: false });
const ConfirmModal = dynamic(() => import("@/app/ui/modals/ConfirmModal"), { ssr: false });
const PaymentModal = dynamic(() => import("@/app/ui/modals/PaymentModal"), { ssr: false });

export interface OfferedServiceView {
  id: string;
  name: string;
  image: string;
  rate: string;
  rateType: string;
}

interface ServiceDetailViewProps {
  serviceId: string;
  handymanId: string;
  galleryImages: string[];
  profilePic: string;
  name: string;
  rating: number;
  reviews: number;
  aboutMe: string;
  experience: string;
  categoryName: string;
  location: string;
  locationCoordinates?: [number, number];
  offeredServices: OfferedServiceView[];
}

export default function ServiceDetailView({
  serviceId,
  handymanId,
  galleryImages,
  profilePic,
  name,
  rating,
  reviews,
  aboutMe,
  experience,
  categoryName,
  location,
  locationCoordinates,
  offeredServices,
}: ServiceDetailViewProps) {
  const router = useRouter();

  // Modal states
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedService, setSelectedService] = useState<number>(0);

  if (!name) {
    notFound();
  }

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

  const handleBooked = () => {
    setPaymentModalOpen(false);
    setBookingData(null);
  };

  const handleServiceSelect = (index: number) => {
    setSelectedService(index);
  };

  const selectedOfferedService = offeredServices[selectedService];
  const bookingInput =
    bookingData && selectedOfferedService
      ? {
          serviceId: selectedOfferedService.id || serviceId,
          handymanId,
          scheduledDate: bookingData.dateISO,
          totalAmount: bookingData.price,
        }
      : null;

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
            <ServiceGallery images={galleryImages} />

            <div className="space-y-12 mt-12">
              <HandymanProfile
                image={profilePic}
                name={name}
                rating={rating}
                reviews={reviews}
              />

              <AboutHandyman
                aboutMe={aboutMe}
                experience={experience}
                previousWork={[]}
                category={categoryName}
              />

              <ReviewSection
                rating={rating}
                count={reviews}
                review={null}
              />

              <LocationMap address={location} coordinates={locationCoordinates} />
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <aside className="lg:w-[24rem]">
            <div className="sticky top-28">
              <BookingSidebar
                handymanName={name}
                services={offeredServices}
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
        services={offeredServices}
        handymanName={name}
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
        handymanName={name}
        handymanImage={profilePic}
        location={location}
      />

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onGoBack={() => {
          setPaymentModalOpen(false);
          setConfirmModalOpen(true);
        }}
        bookingInput={bookingInput}
        amount={bookingData?.price || 30}
        onBooked={handleBooked}
      />
    </div>
  );
}

// Re-exported for the loading skeleton parity with the previous mock delay.
export function ServiceDetailLoading() {
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
