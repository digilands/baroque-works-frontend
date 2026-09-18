import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { backendApi } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Call backend with the token
    const response = await backendApi.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data.user || response.data; // Handle potential wrapper

    return NextResponse.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch user error:', message);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
