import { prisma } from '../config/database';
import { ShortlistEntity } from '../entities/Shortlist.entity';

/**
 * Shortlist Repository
 * 
 * Handles all database operations for Shortlist entity.
 */
export class ShortlistRepository {
  async findById(id: string) {
    const shortlist = await prisma.shortlist.findUnique({
      where: { id },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return shortlist ? new ShortlistEntity(shortlist) : null;
  }

  async findByCSRRep(csrRepId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const shortlists = await prisma.shortlist.findMany({
      where: { csrRepId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return shortlists.map(s => new ShortlistEntity(s));
  }

  async findByRequest(requestId: string) {
    const shortlists = await prisma.shortlist.findMany({
      where: { requestId },
      include: {
        csrRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return shortlists.map(s => new ShortlistEntity(s));
  }

  async create(data: {
    csrRepId: string;
    requestId: string;
  }) {
    const shortlist = await prisma.shortlist.create({
      data,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
    });
    return new ShortlistEntity(shortlist);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.shortlist.delete({ where: { id } });
    return true;
  }

  async deleteByCSRRepAndRequest(csrRepId: string, requestId: string): Promise<boolean> {
    await prisma.shortlist.delete({
      where: {
        csrRepId_requestId: { csrRepId, requestId },
      },
    });
    return true;
  }

  async exists(csrRepId: string, requestId: string): Promise<boolean> {
    const shortlist = await prisma.shortlist.findUnique({
      where: {
        csrRepId_requestId: { csrRepId, requestId },
      },
    });
    return !!shortlist;
  }

  async countByCSRRep(csrRepId: string): Promise<number> {
    return prisma.shortlist.count({ where: { csrRepId } });
  }

  async countByRequest(requestId: string): Promise<number> {
    return prisma.shortlist.count({ where: { requestId } });
  }
}
