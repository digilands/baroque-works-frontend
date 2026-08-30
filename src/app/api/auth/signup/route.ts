import { NextResponse } from 'next/server';
import { backendApi } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Call Backend API
    const response = await backendApi.post('/auth/signup', body);
    
    // Assuming successful signup returns 201 and some user data
    // We don't necessarily log them in immediately unless the backend returns a token
    // If backend returns token, we could set cookie here too.
    // For now, let's just return success so frontend can redirect to login.
    
    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    console.error('Signup error:', error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Signup failed' }, 
      { status: error.response?.status || 500 }
    );
  }
}
