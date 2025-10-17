import { prisma } from '../config/database';
import { MatchEntity } from '../entities/Match.entity';
import { MatchStatus } from '@prisma/client';

/**
 * Match Repository
 * 
 * Handles all database operations for Match entity.
 */
export class MatchRepository {
  async findById(id: string) {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return match ? new MatchEntity(match) : null;
  }

  async findByRequestId(requestId: string) {
    const match = await prisma.match.findUnique({
      where: { requestId },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return match ? new MatchEntity(match) : null;
  }

  async findByPIN(pinId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const matches = await prisma.match.findMany({
      where: { pinId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
      },
      orderBy: { matchedAt: 'desc' },
    });
    return matches.map(m => new MatchEntity(m));
  }

  async findByCSRRep(csrRepId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const matches = await prisma.match.findMany({
      where: { csrRepId },
      skip,
      take: limit,
      include: {
        request: { include: { pin: true, category: true } },
        pin: true,
      },
      orderBy: { matchedAt: 'desc' },
    });
    return matches.map(m => new MatchEntity(m));
  }

  async create(data: {
    requestId: string;
    csrRepId: string;
    pinId: string;
    status?: MatchStatus;
  }) {
    const match = await prisma.match.create({
      data: {
        ...data,
        status: data.status || MatchStatus.ACTIVE,
      },
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return new MatchEntity(match);
  }

  async update(id: string, data: Partial<{
    status: MatchStatus;
    completedAt: Date;
    cancellationReason: string;
  }>) {
    const match = await prisma.match.update({
      where: { id },
      data,
      include: {
        request: { include: { pin: true, category: true } },
        csrRep: true,
        pin: true,
      },
    });
    return new MatchEntity(match);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.match.delete({ where: { id } });
    return true;
  }

  async countByPIN(pinId: string): Promise<number> {
    return prisma.match.count({ where: { pinId } });
  }

  async countByCSRRep(csrRepId: string): Promise<number> {
    return prisma.match.count({ where: { csrRepId } });
  }

  async count(): Promise<number> {
    return prisma.match.count();
  }
}
