export type UserId = 'user_1' | 'user_2';

export interface JWTPayload {
  userId: UserId;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userId?: UserId;
  error?: string;
}
