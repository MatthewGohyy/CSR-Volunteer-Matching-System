import { prisma } from '../config/database';
import { CSRRepEntity } from '../entities/CSRRep.entity';

/**
 * CSR Rep Repository
 * 
 * Handles all database operations for CSRRep entity.
 */
export class CSRRepRepository {
  async findById(id: string) {
    const csrRep = await prisma.cSRRep.findUnique({
      where: { id },
    });
    return csrRep ? new CSRRepEntity(csrRep) : null;
  }

  async findByUserId(userId: string) {
    const csrRep = await prisma.cSRRep.findUnique({
      where: { userId },
    });
    return csrRep ? new CSRRepEntity(csrRep) : null;
  }

  async create(data: {
    userId: string;
    companyName: string;
    companyRegistrationNumber: string;
    industry?: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress?: string;
    companyLogo?: string;
  }) {
    const csrRep = await prisma.cSRRep.create({
      data,
    });
    return new CSRRepEntity(csrRep);
  }

  async update(id: string, data: Partial<{
    companyName: string;
    industry: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress: string;
    companyLogo: string;
  }>) {
    const csrRep = await prisma.cSRRep.update({
      where: { id },
      data,
    });
    return new CSRRepEntity(csrRep);
  }

  async updateByUserId(userId: string, data: Partial<{
    companyName: string;
    industry: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress: string;
    companyLogo: string;
  }>) {
    const csrRep = await prisma.cSRRep.update({
      where: { userId },
      data,
    });
    return new CSRRepEntity(csrRep);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.cSRRep.delete({ where: { id } });
    return true;
  }
}
