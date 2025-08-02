import jwt from 'jsonwebtoken';

interface UserData {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (userData: UserData): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(
    { 
      id: userData.id,
      email: userData.email,
      role: userData.role
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as jwt.SignOptions
  );
}; 