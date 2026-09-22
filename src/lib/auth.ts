import axios from 'axios';
import { toApiError } from './api-errors';

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

// Single-flight session refresh shared across concurrent 401s.
let refreshPromise: Promise<void> | null = null;

function refreshSession(): Promise<void> {
  refreshPromise ??= internalApi
    .post('/auth/refresh')
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/refresh'];

// Auto-refresh the session once per request on 401, then retry.
// Auth routes are excluded to avoid refresh loops.
internalApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const status = error.response?.status as number | undefined;
    const url = (original?.url ?? '') as string;
    const isAuthRoute = AUTH_ROUTES.some((r) => url.includes(r));

    if (status !== 401 || !original || original._retry || isAuthRoute) {
      throw toApiError(error);
    }

    original._retry = true;
    try {
      await refreshSession();
      return internalApi(original);
    } catch (refreshError) {
      throw toApiError(refreshError, 'Session expired');
    }
  },
);

// Types
export interface User {
  _id: string;
  email: string;
  fullname: string;
  role: 'admin' | 'handyman' | 'client';
  avatar?: string;
  phone?: string;
  bio?: string;
  address?: string;
  image?: { url?: string; public_id?: string }[];
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
  // Omit role for first-time signup — the user picks it on /auth/role-selection.
  role?: 'client' | 'handyman';
  // Add other signup fields
}
