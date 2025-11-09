import request from 'supertest';
import express from 'express';
import { UserStatus } from '@prisma/client';
import { hashPassword } from '../../src/utils/password';
import { prisma } from '../../src/config/database';

const BASE_URL = 'http://localhost:4000';

/**
 * API Test Helper Functions
 * Provides common functions for API testing
 */

export class APIHelper {
  /**
   * Login a user and get auth token
   */
  static async loginUser(email: string, password: string): Promise<string> {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    return response.body.token;
  }

  /**
   * Create a test user with specific role
   */
  static async createTestUser(
    userProfileId: string,
    userData: any,
    password: string
  ) {
    const hashedPassword = await hashPassword(password);

    return await prisma.userAccount.create({
      data: {
        ...userData,
        password: hashedPassword,
        userProfileId,
        status: UserStatus.ACTIVE,
      },
    });
  }

  /**
   * Create a test user profile
   */
  static async createTestProfile(profileData: any) {
    return await prisma.userProfile.create({
      data: profileData,
    });
  }

  /**
   * Clean up test user by email
   */
  static async cleanupUserByEmail(email: string) {
    try {
      await prisma.userAccount.delete({
        where: { email },
      });
    } catch (error) {
      // Ignore if user doesn't exist
    }
  }

  /**
   * Clean up test profile by name
   */
  static async cleanupProfileByName(name: string) {
    try {
      await prisma.userProfile.delete({
        where: { name },
      });
    } catch (error) {
      // Ignore if profile doesn't exist
    }
  }

  /**
   * Get user profile by name
   */
  static async getUserProfileByName(name: string) {
    return await prisma.userProfile.findUnique({
      where: { name },
    });
  }
}

