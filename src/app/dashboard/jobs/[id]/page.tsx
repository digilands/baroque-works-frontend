import React from 'react';
import { JobHeader } from '@/app/ui/jobs/JobHeader';
import { LocationCard } from '@/app/ui/jobs/LocationCard';
import { TaskOverviewCard } from '@/app/ui/jobs/TaskOverviewCard';
import { ClientCard } from '@/app/ui/jobs/ClientCard';
import { SchedulePayCard } from '@/app/ui/jobs/SchedulePayCard';
import { JobActionFooter } from '@/app/ui/jobs/JobActionFooter';
import { JobRequest } from '@/types/job';

// Mock Data Fetcher
async function getJobRequest(id: string): Promise<JobRequest> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: id,
    title: "Fix leaking pipe in kitchen",
    status: 'pending',
    requestedDate: "Oct 24, 2025",
    requestedTime: "10:00 AM",
    description: "The pipe under the kitchen sink is leaking water. I've tried tightening it but it still drips. Need someone to fix it ASAP.",
    instructions: "Please enter through the side gate. The code is 1234.",
    photos: [
      "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
    ],
    client: {
      id: "c1",
      name: "Sarah Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      rating: 4.8,
      totalJobs: 12,
      isVerified: true,
      isRepeatClient: true,
      memberSince: "Aug 2023"
    },
    location: {
      address: "123 Maple Avenue",
      city: "Lagos",
      state: "Lagos",
      distance: "2.5km",
      coordinates: { lat: 6.5244, lng: 3.3792 }
    },
    financials: {
      subtotal: 15000,
      serviceFee: 1500,
      tax: 1200,
      total: 17700,
      paymentStatus: 'pending'
    },
    createdAt: "2025-10-23T14:00:00Z"
  };
}

export default async function JobRequestPage({ params }: { params: { id: string } }) {
  const job = await getJobRequest(params.id);

  // In a real app, these would be Server Actions
  async function handleAccept() {
    'use server';
    console.log('Accepted job', params.id);
  }

  async function handleDecline() {
    'use server';
    console.log('Declined job', params.id);
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <JobHeader title={job.title} requestId={job.id} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Info */}
        <div className="lg:col-span-2">
          <TaskOverviewCard 
             description={job.description} 
             photos={job.photos} 
             instructions={job.instructions}
          />
          
          <div className="block lg:hidden mb-8">
             <ClientCard client={job.client} />
          </div>

          <LocationCard location={job.location} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="hidden lg:block">
            <ClientCard client={job.client} />
          </div>
          
          <SchedulePayCard 
             requestedDate={job.requestedDate} 
             requestedTime={job.requestedTime}
             financials={job.financials}
          />
        </div>
      </div>

      <JobActionFooter 
        price={`₦${job.financials.total.toLocaleString()}`}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
}
