import jwt, { SignOptions } from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface TokenPayload {
  userId: string;
  email: string;
  userType: UserType;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars';
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars';
  return jwt.verify(token, secret) as TokenPayload;
};

