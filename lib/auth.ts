import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import type { UserId, JWTPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-change-in-production'
);

const USER_1_PASSWORD_HASH = process.env.USER_1_PASSWORD_HASH || '';
const USER_2_PASSWORD_HASH = process.env.USER_2_PASSWORD_HASH || '';

export async function verifyPassword(password: string): Promise<UserId | null> {
  const user1Hash = process.env.USER_1_PASSWORD_HASH;
  const user2Hash = process.env.USER_2_PASSWORD_HASH;

  if (!user1Hash || !user2Hash) {
    throw new Error('Password hashes not configured');
  }

  // Check user 1
  const user1Match = await bcrypt.compare(password, user1Hash);
  if (user1Match) {
    return 'user_1';
  }

  // Check user 2
  const user2Match = await bcrypt.compare(password, user2Hash);
  if (user2Match) {
    return 'user_2';
  }

  return null;
}

export async function createSession(userId: UserId): Promise<void> {
  const token = await new SignJWT({ userId } as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
