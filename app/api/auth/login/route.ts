import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' } as LoginResponse,
        { status: 400 }
      );
    }

    const userId = await verifyPassword(password);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' } as LoginResponse,
        { status: 401 }
      );
    }

    await createSession(userId);

    return NextResponse.json(
      { success: true, userId } as LoginResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as LoginResponse,
      { status: 500 }
    );
  }
}
