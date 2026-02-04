import axios from 'axios';

// Create a configured axios instance for CLIENT-SIDE use
// Note: For server-side calls (Route Handlers), we might need a separate instance or configuration
// because cookies are handled differently.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 1. Client-side Axios Instance (calls Next.js Internal API)
export const internalApi = axios.create({
  baseURL: '/api', // Calls our own Next.js Route Handlers
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Server-side Axios Instance (calls NestJS Backend)
// This is used inside our Route Handlers (e.g., api/auth/login)
export const backendApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important if backend sets cookies directly (though we use BFF)
});

// Types
export interface User {
  _id: string;
  email: string;
  fullname: string;
  role: 'Admin' | 'Handyman' | 'Client';
  avatar?: string;
  // Add other fields as needed
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullname: string;
  email: string;
  password: string;
  role: 'Client' | 'Handyman'; 
  // Add other signup fields
}
