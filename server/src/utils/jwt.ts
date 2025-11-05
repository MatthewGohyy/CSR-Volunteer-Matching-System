import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string; // Profile name (was UserProfileRole)
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars';
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};

