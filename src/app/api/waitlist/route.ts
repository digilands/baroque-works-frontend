import { NextResponse } from 'next/server';
import { backendApi } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await backendApi.post('/waitlist', body);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Waitlist error:', error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { success: false, message: 'Failed to join waitlist' },
      { status: error.response?.status || 500 }
    );
  }
}
