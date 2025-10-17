import { prisma } from '../config/database';
import { PINEntity } from '../entities/PIN.entity';

/**
 * PIN Repository
 * 
 * Handles all database operations for PIN entity.
 */
export class PINRepository {
  async findById(id: string) {
    const pin = await prisma.pIN.findUnique({
      where: { id },
    });
    return pin ? new PINEntity(pin) : null;
  }

  async findByUserId(userId: string) {
    const pin = await prisma.pIN.findUnique({
      where: { userId },
    });
    return pin ? new PINEntity(pin) : null;
  }

  async create(data: {
    userId: string;
    name: string;
    age?: number;
    location?: string;
    phoneNumber?: string;
    accessibilityNeeds?: string;
    profilePhoto?: string;
  }) {
    const pin = await prisma.pIN.create({
      data,
    });
    return new PINEntity(pin);
  }

  async update(id: string, data: Partial<{
    name: string;
    age: number;
    location: string;
    phoneNumber: string;
    accessibilityNeeds: string;
    profilePhoto: string;
  }>) {
    const pin = await prisma.pIN.update({
      where: { id },
      data,
    });
    return new PINEntity(pin);
  }

  async updateByUserId(userId: string, data: Partial<{
    name: string;
    age: number;
    location: string;
    phoneNumber: string;
    accessibilityNeeds: string;
    profilePhoto: string;
  }>) {
    const pin = await prisma.pIN.update({
      where: { userId },
      data,
    });
    return new PINEntity(pin);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.pIN.delete({ where: { id } });
    return true;
  }
}
