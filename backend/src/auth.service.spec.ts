import { AuthService } from './services/auth.service';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('@prisma/client');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrismaFindFirst: jest.Mock;

  beforeEach(() => {
    mockPrismaFindFirst = jest.fn();
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => ({
      user: {
        findFirst: mockPrismaFindFirst
      }
    } as unknown as PrismaClient));
    authService = new AuthService();
  });

  describe('userLogin', () => {
    it('should successfully log in a user and return success meassage and token and also role', async () => {
      const mockUser = {
        userId: 'user-id',
        email: 'marshal@yopmail.com',
        password: 'hashedPassword',
        role: 'user'
      };
      mockPrismaFindFirst.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

      const result = await authService.userLogin({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toEqual({
        message: "Login successful",
        responseCode: 200,
        token: 'mocked-token',
        role: 'user'
      });
    });

    it('should return error for wrong email', async () => {
      mockPrismaFindFirst.mockResolvedValue(null);

      const result = await authService.userLogin({
        email: 'notfound@example.com',
        password: 'password123'
      });

      expect(result).toEqual({
        error: true,
        message: "User not found"
      });
    });

    it('should return error for invalid password', async () => {
      mockPrismaFindFirst.mockResolvedValue({
        userId: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword'
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.userLogin({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      expect(result).toEqual({
        error: true,
        message: "Invalid password"
      });
    });
  });
});
