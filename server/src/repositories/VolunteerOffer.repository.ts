import { prisma } from '../config/database';
import { VolunteerOfferEntity } from '../entities/VolunteerOffer.entity';
import { OfferStatus } from '@prisma/client';

/**
 * Volunteer Offer Repository
 * 
 * Handles all database operations for VolunteerOffer entity.
 */
export class VolunteerOfferRepository {
  async findById(id: string) {
    const offer = await prisma.volunteerOffer.findUnique({
      where: { id },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return offer ? new VolunteerOfferEntity(offer) : null;
  }

  async findByCSRRep(csrRepId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const offers = await prisma.volunteerOffer.findMany({
      where: { csrRepId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOfferEntity(o));
  }

  async findByRequest(requestId: string) {
    const offers = await prisma.volunteerOffer.findMany({
      where: { requestId },
      include: {
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOfferEntity(o));
  }

  async findByStatus(status: OfferStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const offers = await prisma.volunteerOffer.findMany({
      where: { status },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return offers.map(o => new VolunteerOfferEntity(o));
  }

  async create(data: {
    csrRepId: string;
    requestId: string;
    message?: string;
  }) {
    const offer = await prisma.volunteerOffer.create({
      data: {
        ...data,
        status: OfferStatus.PENDING,
      },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return new VolunteerOfferEntity(offer);
  }

  async update(id: string, data: Partial<{
    message: string;
    status: OfferStatus;
  }>) {
    const offer = await prisma.volunteerOffer.update({
      where: { id },
      data,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return new VolunteerOfferEntity(offer);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.volunteerOffer.delete({ where: { id } });
    return true;
  }

  async countByCSRRep(csrRepId: string): Promise<number> {
    return prisma.volunteerOffer.count({ where: { csrRepId } });
  }

  async countByRequest(requestId: string): Promise<number> {
    return prisma.volunteerOffer.count({ where: { requestId } });
  }

  async countByStatus(status: OfferStatus): Promise<number> {
    return prisma.volunteerOffer.count({ where: { status } });
  }
}
