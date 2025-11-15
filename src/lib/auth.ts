import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function verifyAdmin(credentials: LoginCredentials): Promise<AdminUser | null> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: credentials.email },
    });

    if (!admin) {
      return null;
    }

    const isValid = await bcrypt.compare(credentials.password, admin.password);
    if (!isValid) {
      return null;
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
  } catch (error) {
    console.error('Error verifying admin:', error);
    return null;
  }
}

export function generateToken(admin: AdminUser): string {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function createAdmin(email: string, password: string, name?: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  });
}

