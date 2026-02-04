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
  } catch (error: any) {
    console.error('Fetch user error:', error.message);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
