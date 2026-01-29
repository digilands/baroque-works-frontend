import React from 'react';
import { notFound } from "next/navigation";
import { handymen } from "@/utils/data";
import ServiceGallery from "@/app/ui/ServiceGallery";
import HandymanProfile from "@/app/ui/HandymanProfile";
import AboutHandyman from "@/app/ui/AboutHandyman";
import ReviewSection from "@/app/ui/ReviewSection";
import LocationMap from "@/app/ui/LocationMap";
import BookingSidebar from "@/app/ui/BookingSidebar";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const handyman = handymen.find((h) => h.id === parseInt(id));

    if (!handyman) {
        notFound();
    }

    // Ensure profile properties exist to avoid runtime errors if data is missing
    const { profile, offeredServices } = handyman;

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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
