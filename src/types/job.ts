export interface Client {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  totalJobs: number;
  isVerified: boolean;
  isRepeatClient: boolean;
  memberSince: string;
}

export interface JobLocation {
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: string;
}

export interface Financials {
  total: number;
  subtotal: number;
  tax: number;
  serviceFee: number;
  discount?: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface JobRequest {
  id: string;
  title: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  client: Client;
  location: JobLocation;
  financials: Financials;
  requestedDate: string;
  requestedTime: string;
  description: string;
  photos: string[];
  instructions?: string;
  createdAt: string;
}
