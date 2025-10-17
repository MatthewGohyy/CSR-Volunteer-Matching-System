import { prisma } from '../config/database';
import { UserEntity } from '../entities/User.entity';
import { UserType, UserStatus } from '@prisma/client';

/**
 * User Repository
 * 
 * Handles all database operations for User entity.
 * Controllers should call these methods instead of using Prisma directly.
 */
export class UserRepository {
  /**
   * Find all users with pagination
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return user ? new UserEntity(user) : null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return user ? new UserEntity(user) : null;
  }

  /**
   * Find users by type
   */
  async findByType(userType: UserType, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: { userType },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Find users by status
   */
  async findByStatus(status: UserStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: { status },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    password: string;
    userType: UserType;
    status?: UserStatus;
  }) {
    const user = await prisma.user.create({
      data: {
        ...data,
        status: data.status || UserStatus.ACTIVE,
      },
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return new UserEntity(user);
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<{
    email: string;
    password: string;
    userType: UserType;
    status: UserStatus;
  }>) {
    const user = await prisma.user.update({
      where: { id },
      data,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
    });
    return new UserEntity(user);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    return prisma.user.count();
  }

  /**
   * Count users by type
   */
  async countByType(userType: UserType): Promise<number> {
    return prisma.user.count({
      where: { userType },
    });
  }

  /**
   * Count users by status
   */
  async countByStatus(status: UserStatus): Promise<number> {
    return prisma.user.count({
      where: { status },
    });
  }

  /**
   * Search users
   */
  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { pin: { name: { contains: query, mode: 'insensitive' } } },
          { csrRep: { companyName: { contains: query, mode: 'insensitive' } } },
          { platformManager: { fullName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      skip,
      take: limit,
      include: {
        pin: true,
        csrRep: true,
        platformManager: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserEntity(user));
  }

  /**
   * Suspend user account
   */
  async suspend(id: string) {
    return this.update(id, { status: UserStatus.SUSPENDED });
  }

  /**
   * Activate user account
   */
  async activate(id: string) {
    return this.update(id, { status: UserStatus.ACTIVE });
  }

  /**
   * Deactivate user account
   */
  async deactivate(id: string) {
    return this.update(id, { status: UserStatus.DEACTIVATED });
  }
}
