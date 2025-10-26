import { UserAccount as PrismaUserAccount, UserProfileRole, UserStatus, UserProfile, ProfileStatus } from '@prisma/client';
import { prisma } from '../config/database';

type UserAccountWithProfile = PrismaUserAccount & {
  userProfile?: UserProfile | null;
};

/**
 * UserAccount Entity Class
 * 
 * Represents a user account in the system with business logic and CRUD methods.
 * Follows the BCE framework - Entity handles all database operations.
 * 
 * This entity consolidates all user types (PIN, CSR Rep, Platform Manager, User Admin)
 * into a single table with role-specific fields.
 */
export class UserAccountEntity implements PrismaUserAccount {
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
   * Check if user is active
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user is suspended
   */
  isSuspended(): boolean {
    return this.status === UserStatus.SUSPENDED;
  }

  /**
   * Check if user is deleted
   */
  isDeleted(): boolean {
    return this.status === UserStatus.SUSPENDED; // Soft deletes use SUSPENDED status
  }

  /**
   * Get user role from profile
   */
  getRole(): UserProfileRole | null {
    return this.userProfile?.role || null;
  }

  /**
   * Check if user is admin based on profile role
   */
  isAdmin(): boolean {
    return this.userProfile?.role === UserProfileRole.USER_ADMIN;
  }

  /**
   * Check if user is PIN (Person In Need)
   */
  isPIN(): boolean {
    return this.userProfile?.role === UserProfileRole.PIN;
  }

  /**
   * Check if user is CSR Representative
   */
  isCSRRep(): boolean {
    return this.userProfile?.role === UserProfileRole.CSR_REP;
  }

  /**
   * Check if user is Platform Manager
   */
  isPlatformManager(): boolean {
    return this.userProfile?.role === UserProfileRole.PLATFORM_MANAGER;
  }

  /**
   * Check if PIN profile is complete
   */
  isPINProfileComplete(): boolean {
    if (!this.isPIN()) return false;
    return !!(this.name && this.location && this.phoneNumber);
  }

  /**
   * Check if CSR Rep profile is complete
   */
  isCSRRepProfileComplete(): boolean {
    if (!this.isCSRRep()) return false;
    return !!(
      this.companyName &&
      this.companyRegistrationNumber &&
      this.contactPerson &&
      this.phoneNumber
    );
  }

  /**
   * Check if Platform Manager profile is complete
   */
  isPlatformManagerProfileComplete(): boolean {
    if (!this.isPlatformManager()) return false;
    return !!(this.name && this.phoneNumber);
  }

  /**
   * Check if has accessibility needs (PIN specific)
   */
  hasAccessibilityNeeds(): boolean {
    return !!this.accessibilityNeeds;
  }

  /**
   * Check if senior (65+) (PIN specific)
   */
  isSenior(): boolean {
    return this.age !== null && this.age >= 65;
  }

  /**
   * Check if has company logo (CSR Rep specific)
   */
  hasLogo(): boolean {
    return !!this.companyLogo;
  }

  /**
   * Get display name based on role
   */
  getDisplayName(): string {
    if (this.isCSRRep() && this.companyName) return this.companyName;
    return this.name;
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
    return users.map(user => new UserAccountEntity(user));
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
    return user ? new UserAccountEntity(user) : null;
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
    return user ? new UserAccountEntity(user) : null;
  }

  /**
   * Find user by user ID with role check
   * Used for PIN/CSR Rep operations
   */
  static async findByUserIdWithRole(userId: string, role: UserProfileRole) {
    const user = await prisma.userAccount.findUnique({
      where: { id: userId },
      include: {
        userProfile: true,
      },
    });
    if (!user || user.userProfile?.role !== role) return null;
    return new UserAccountEntity(user);
  }

  /**
   * Find users by profile role
   */
  static async findByProfileRole(role: UserProfileRole, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.userAccount.findMany({
      where: { 
        userProfile: { role } 
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
    return users.map(user => new UserAccountEntity(user));
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
    return users.map(user => new UserAccountEntity(user));
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
    return new UserAccountEntity(user);
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
    const user = await prisma.userAccount.update({
      where: { id },
      data,
      include: {
        userProfile: true,
      },
    });
    return new UserAccountEntity(user);
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
   * Hard delete user account
   */
  static async hardDelete(id: string): Promise<boolean> {
    await prisma.userAccount.delete({
      where: { id },
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
   * Count users by profile role
   */
  static async countByProfileRole(role: UserProfileRole): Promise<number> {
    return prisma.userAccount.count({
      where: { 
        userProfile: { role } 
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
    return users.map(user => new UserAccountEntity(user));
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
