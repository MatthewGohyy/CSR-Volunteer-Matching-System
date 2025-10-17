import { prisma } from '../config/database';
import { ServiceCategoryEntity } from '../entities/ServiceCategory.entity';

/**
 * Service Category Repository
 * 
 * Handles all database operations for ServiceCategory entity.
 */
export class ServiceCategoryRepository {
  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const categories = await prisma.serviceCategory.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new ServiceCategoryEntity(c));
  }

  async findActive() {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new ServiceCategoryEntity(c));
  }

  async findById(id: string) {
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
    });
    return category ? new ServiceCategoryEntity(category) : null;
  }

  async create(data: {
    name: string;
    description?: string;
    iconUrl?: string;
    isActive?: boolean;
  }) {
    const category = await prisma.serviceCategory.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
    return new ServiceCategoryEntity(category);
  }

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    iconUrl: string;
    isActive: boolean;
  }>) {
    const category = await prisma.serviceCategory.update({
      where: { id },
      data,
    });
    return new ServiceCategoryEntity(category);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.serviceCategory.delete({ where: { id } });
    return true;
  }

  async search(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const categories = await prisma.serviceCategory.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new ServiceCategoryEntity(c));
  }

  async count(): Promise<number> {
    return prisma.serviceCategory.count();
  }
}
