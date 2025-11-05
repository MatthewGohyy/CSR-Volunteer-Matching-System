import { UserAccount as PrismaUserAccount, UserStatus, UserProfile, ProfileStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

type UserAccountWithProfile = PrismaUserAccount & {
  userProfile?: UserProfile | null;
};

/**
 * Login Result Interface
 * Returns user account, token, and role after successful login
 */
export interface LoginResult {
  user: UserAccount;
  token: string;
  role: string; // Profile name (was UserProfileRole)
}

/**
 * UserAccount Class
 * 
 * Represents a user account in the system with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 * 
 * This entity consolidates all user types (PIN, CSR Rep, Platform Manager, User Admin)
 * into a single table with role-specific fields.
 */
export class UserAccount implements PrismaUserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: Date | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  userProfileId: string;
  
  // PIN-specific fields
  age: number | null;
  location: string | null;
  accessibilityNeeds: string | null;
  profilePhoto: string | null;
  
  // CSR Rep-specific fields
  companyName: string | null;
  companyRegistrationNumber: string | null;
  industry: string | null;
  contactPerson: string | null;
  companyAddress: string | null;
  companyLogo: string | null;
  
  // Platform Manager-specific fields
  department: string | null;
  
  // Profile status (for profile operations)
  profileStatus: ProfileStatus;

  // Related data
  userProfile?: UserProfile | null;

  constructor(data: UserAccountWithProfile) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.phoneNumber = data.phoneNumber;
    this.address = data.address;
    this.dateOfBirth = data.dateOfBirth;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.userProfileId = data.userProfileId;
    this.age = data.age;
    this.location = data.location;
    this.accessibilityNeeds = data.accessibilityNeeds;
    this.profilePhoto = data.profilePhoto;
    this.companyName = data.companyName;
    this.companyRegistrationNumber = data.companyRegistrationNumber;
    this.industry = data.industry;
    this.contactPerson = data.contactPerson;
    this.companyAddress = data.companyAddress;
    this.companyLogo = data.companyLogo;
    this.department = data.department;
    this.profileStatus = data.profileStatus;
    this.userProfile = data.userProfile;
  }

  /**
   * Get user role - returns profile name
   */
  getRole(): string | null {
    return this.userProfile?.name || null;
  }


  /**
   * Get user data without password (for API responses)
   */
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // ============================================
  // CRUD Methods (Static) - Database Operations
  // ============================================

  /**
   * Find all users with pagination
   */
  static async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.userAccount.findMany({
      skip,
      take: limit,
      include: {
        userProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserAccount(user));
  }

  /**
   * Find user by ID
   */
  static async findById(id: string) {
    const user = await prisma.userAccount.findUnique({
      where: { id },
      include: {
        userProfile: true,
      },
    });
    return user ? new UserAccount(user) : null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    const user = await prisma.userAccount.findUnique({
      where: { email },
      include: {
        userProfile: true,
      },
    });
    return user ? new UserAccount(user) : null;
  }

  /**
   * Login method - Handles complete login logic
   * Checks user existence, active status, password, and generates token
   * Returns user object with token and role
   */
  static async login(email: string, password: string): Promise<LoginResult> {
    // Find user by email
    const userData = await prisma.userAccount.findUnique({
      where: { email },
      include: {
        userProfile: true,
      },
    });

    // Check if user exists
    if (!userData) {
      throw new Error('Invalid email or password');
    }

    const user = new UserAccount(userData);

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Account is not active');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Get user role
    const role = user.getRole();
    if (!role) {
      throw new Error('User profile not found');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role,
    });

    // Return user object with token and role
    return {
      user,
      token,
      role,
    };
  }

  /**
   * Find user by user ID with profile name check
   * Used for PIN/CSR Rep operations
   */
  static async findByUserIdWithProfileName(userId: string, profileName: string) {
    const user = await prisma.userAccount.findUnique({
      where: { id: userId },
      include: {
        userProfile: true,
      },
    });
    if (!user || user.userProfile?.name !== profileName) return null;
    return new UserAccount(user);
  }

  /**
   * Find users by profile name (replacing findByProfileRole)
   */
  static async findByProfileName(profileName: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.userAccount.findMany({
      where: { 
        userProfile: { name: profileName } 
      },
      skip,
      take: limit,
      include: {
        userProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserAccount(user));
  }

  /**
   * Find users by status
   */
  static async findByStatus(status: UserStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.userAccount.findMany({
      where: { status },
      skip,
      take: limit,
      include: {
        userProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserAccount(user));
  }

  /**
   * Create a new user account
   */
  static async create(data: {
    email: string;
    password: string;
    name: string;
    userProfileId: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: Date;
    status?: UserStatus;
    // PIN-specific optional fields
    age?: number;
    location?: string;
    accessibilityNeeds?: string;
    profilePhoto?: string;
    // CSR Rep-specific optional fields
    companyName?: string;
    companyRegistrationNumber?: string;
    industry?: string;
    contactPerson?: string;
    companyAddress?: string;
    companyLogo?: string;
    // Platform Manager-specific optional fields
    department?: string;
    profileStatus?: ProfileStatus;
  }) {
    // Check if email already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await prisma.userAccount.create({
      data: {
        ...data,
        status: data.status || UserStatus.ACTIVE,
        profileStatus: data.profileStatus || ProfileStatus.ACTIVE,
      },
      include: {
        userProfile: true,
      },
    });
    return new UserAccount(user);
  }

  /**
   * Update user account
   */
  static async update(id: string, data: Partial<{
    email: string;
    password: string;
    name: string;
    userProfileId: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    status: UserStatus;
    age: number;
    location: string;
    accessibilityNeeds: string;
    profilePhoto: string;
    companyName: string;
    companyRegistrationNumber: string;
    industry: string;
    contactPerson: string;
    companyAddress: string;
    companyLogo: string;
    department: string;
    profileStatus: ProfileStatus;
  }>) {
    // If email is being changed, check if new email already exists
    if (data.email) {
      const existingUser = await this.findById(id);
      if (existingUser && data.email !== existingUser.email) {
        const emailExists = await this.findByEmail(data.email);
        if (emailExists) {
          throw new Error('Email already in use');
        }
      }
    }

    const user = await prisma.userAccount.update({
      where: { id },
      data,
      include: {
        userProfile: true,
      },
    });
    return new UserAccount(user);
  }

  /**
   * Delete user account (soft delete)
   */
  static async delete(id: string): Promise<boolean> {
    await prisma.userAccount.update({
      where: { id },
      data: { status: UserStatus.SUSPENDED }, // Use SUSPENDED for soft delete
    });
    return true;
  }

  /**
   * Count total users
   */
  static async count(): Promise<number> {
    return prisma.userAccount.count();
  }

  /**
   * Count users by profile name
   */
  static async countByProfileName(profileName: string): Promise<number> {
    return prisma.userAccount.count({
      where: { 
        userProfile: { name: profileName } 
      },
    });
  }

  /**
   * Count users by status
   */
  static async countByStatus(status: UserStatus): Promise<number> {
    return prisma.userAccount.count({
      where: { status },
    });
  }

  /**
   * Search users by email, name, or company name
   */
  static async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.userAccount.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { companyName: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
      include: {
        userProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map(user => new UserAccount(user));
  }

  /**
   * Suspend user account
   */
  static async suspend(id: string) {
    return this.update(id, { status: UserStatus.SUSPENDED });
  }

  /**
   * Activate user account
   */
  static async activate(id: string) {
    return this.update(id, { status: UserStatus.ACTIVE });
  }

  // ============================================
  // Profile-specific CRUD Methods
  // ============================================

  /**
   * Update PIN profile
   */
  static async updatePINProfile(userId: string, data: Partial<{
    name: string;
    age: number;
    location: string;
    phoneNumber: string;
    accessibilityNeeds: string;
    profilePhoto: string;
  }>) {
    return this.update(userId, data);
  }

  /**
   * Update CSR Rep profile
   */
  static async updateCSRRepProfile(userId: string, data: Partial<{
    companyName: string;
    industry: string;
    contactPerson: string;
    phoneNumber: string;
    companyAddress: string;
    companyLogo: string;
  }>) {
    return this.update(userId, data);
  }

  /**
   * Update Platform Manager profile
   */
  static async updatePlatformManagerProfile(userId: string, data: Partial<{
    name: string;
    department: string;
    phoneNumber: string;
  }>) {
    return this.update(userId, data);
  }

  /**
   * Suspend profile (different from account status)
   */
  static async suspendProfile(id: string) {
    return this.update(id, { profileStatus: ProfileStatus.SUSPENDED });
  }

  /**
   * Activate profile
   */
  static async activateProfile(id: string) {
    return this.update(id, { profileStatus: ProfileStatus.ACTIVE });
  }
}
