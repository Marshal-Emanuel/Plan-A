import { UsersService } from '../services/users.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/email.service';


jest.mock('@prisma/client');
jest.mock('../../src/services/email.service');

describe('UsersService', () => {
  let usersService: UsersService;
  let mockPrismaCreate: jest.Mock<Promise<any>, any[]>;
  let mockPrismaFindMany: jest.Mock;
  beforeEach(() => {
    mockPrismaCreate = jest.fn();
    mockPrismaFindMany = jest.fn();
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => ({
      user: {
        create: mockPrismaCreate,
        findMany: mockPrismaFindMany,
        findUnique: jest.fn(),
        update: jest.fn()
      },
      appeal: {
        create: jest.fn()
      }
    } as unknown as PrismaClient));
    usersService = new UsersService();
  });



  describe('createUser', () => {
    it('Should register a new user', async () => {
      const mockUser = {
        name: 'Test User',
        phoneNumber: '07124567890',
        email: 'marshal@yopmail.com',
        password: 'marshalpassword',
        profilePicture: 'marshalpic.jpg', 
        isSubscribedToMails: true
      };
  
      mockPrismaCreate.mockResolvedValue({
        ...mockUser,
        userId: 'generated-id',
        role: 'user',
        accountStatus: 'active',
        resetToken: null,
        resetTokenExpiry: null
      });
  
      const result = await usersService.createUser(mockUser);
  
      expect(result).toEqual({
        message: "User created successfully",
        responseCode: 201,
        userId: 'generated-id'
      });
  
      expect(mockPrismaCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: mockUser.name,
          phoneNumber: mockUser.phoneNumber,
          email: mockUser.email,
          profilePicture: mockUser.profilePicture
        })
      });
    });
  });
  


  describe('should viewAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { userId: '1', name: 'User 1', email: 'user1@example.com' },
        { userId: '2', name: 'User 2', email: 'user2@example.com' }
      ];
      mockPrismaFindMany.mockResolvedValue(mockUsers);

      const result = await usersService.viewAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaFindMany).toHaveBeenCalled();
    });
  });


  describe('getUserById', () => {
    it('should return a user by their ID', async () => {
      const mockUser = {
        userId: 'test-user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        phoneNumber: '1234567890',
        profilePicture: 'test-profile-pic.jpg'
      };

      const mockPrismaFindUnique = jest.fn().mockResolvedValue(mockUser);
      (usersService as any).prisma.user.findUnique = mockPrismaFindUnique;

      const result = await usersService.getUserById('test-user-id');

      expect(result).toEqual(mockUser);
      expect(mockPrismaFindUnique).toHaveBeenCalledWith({
        where: { userId: 'test-user-id' }
      });
    });
  });


  describe('disableUser', () => {
    it('should allow admin to disable a user account', async () => {
      const mockUser = {
        userId: 'user-to-disable',
        email: 'user@example.com',
        name: 'User to Disable'
      };
  
      const mockPrismaUpdate = jest.fn().mockResolvedValue({
        ...mockUser,
        accountStatus: 'banned'
      });
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const result = await usersService.disableUser('user-to-disable');
  
      expect(result).toEqual({
        message: "User account disabled successfully",
        responseCode: 200
      });
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { userId: 'user-to-disable' },
        data: { accountStatus: 'banned' }
      });
    });
  
    it('should handle errors when disabling a user account', async () => {
      const mockPrismaUpdate = jest.fn().mockRejectedValue(new Error('Database error'));
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const result = await usersService.disableUser('non-existent-user');
  
      expect(result).toEqual({
        message: "An error occurred while disabling the user account.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });
  



  describe('enableUser', () => {
    it('should allow admin to enable a user account', async () => {
      const mockUser = {
        userId: 'user-to-enable',
        email: 'user@example.com',
        name: 'User to Enable'
      };
  
      const mockPrismaUpdate = jest.fn().mockResolvedValue({
        ...mockUser,
        accountStatus: 'active'
      });
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const result = await usersService.enableUser('user-to-enable');
  
      expect(result).toEqual({
        message: "User account enabled successfully",
        responseCode: 200
      });
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { userId: 'user-to-enable' },
        data: { accountStatus: 'active' }
      });
    });
  
    it('should handle errors when enabling a user account', async () => {
      const mockPrismaUpdate = jest.fn().mockRejectedValue(new Error('Database error'));
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const result = await usersService.enableUser('non-existent-user');
  
      expect(result).toEqual({
        message: "An error occurred while enabling the user account.",
        responseCode: 500,
        error: expect.any(Error)
      });
    });
  });
  




  describe('managerRequest', () => {
    it('should set user account status to pending and notify admins', async () => {
      const mockUser = {
        userId: 'user-requesting-manager',
        email: 'user@example.com',
        name: 'User Requesting Manager'
      };
  
      const mockAdmins = [
        { email: 'admin1@example.com' },
        { email: 'admin2@example.com' }
      ];
  
      const mockPrismaUpdate = jest.fn().mockResolvedValue({
        ...mockUser,
        accountStatus: 'pending'
      });
      const mockPrismaFindMany = jest.fn().mockResolvedValue(mockAdmins);
      (usersService as any).prisma.user.update = mockPrismaUpdate;
      (usersService as any).prisma.user.findMany = mockPrismaFindMany;
  
      const mockSendManagerRequestNotification = jest.fn().mockResolvedValue(true);
      (usersService as any).emailService.sendManagerRequestNotification = mockSendManagerRequestNotification;
  
      const result = await usersService.managerRequest('user-requesting-manager');
  
      expect(result).toEqual({
        message: "Request for Account upgrade sent",
        responseCode: 200
      });
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { userId: 'user-requesting-manager' },
        data: { accountStatus: 'pending' }
      });
      expect(mockPrismaFindMany).toHaveBeenCalledWith({ where: { role: 'admin' } });
      expect(mockSendManagerRequestNotification).toHaveBeenCalledTimes(2);
    });
  });
  



  describe('verifyAccount', () => {
    it('should set user account status to verified and role to manager', async () => {
      const mockUser = {
        userId: 'user-to-verify',
        email: 'user@example.com',
        name: 'User to Verify'
      };
  
      const mockPrismaUpdate = jest.fn().mockResolvedValue({
        ...mockUser,
        accountStatus: 'verified',
        role: 'manager'
      });
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const mockSendVerificationEmail = jest.fn().mockResolvedValue(true);
      (usersService as any).emailService.sendAccountVerificationEmail = mockSendVerificationEmail;
  
      const result = await usersService.verifyAccount('user-to-verify');
  
      expect(result).toEqual({
        message: "Account verified, role set to manager, and notification sent",
        responseCode: 200
      });
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { userId: 'user-to-verify' },
        data: { 
          accountStatus: 'verified',
          role: 'manager'
        }
      });
      expect(mockSendVerificationEmail).toHaveBeenCalledWith('user@example.com', 'User to Verify');
    });
  });
  


  describe('createAppeal', () => {
    it('should create an appeal and notify admins', async () => {
      const mockUser = {
        userId: 'appealing-user',
        email: 'user@example.com',
        name: 'Appealing User',
        role: 'user'
      };
  
      const mockAppeal = {
        appealId: 'appeal-123',
        userId: 'appealing-user',
        reason: 'Unfair ban',
        details: 'I believe my account was banned by mistake',
        createdAt: new Date()
      };
  
      const mockAdmins = [
        { email: 'admin1@example.com' },
        { email: 'admin2@example.com' }
      ];
  
      const mockPrismaCreateAppeal = jest.fn().mockResolvedValue(mockAppeal);
      const mockPrismaFindUniqueUser = jest.fn().mockResolvedValue(mockUser);
      const mockPrismaFindManyAdmins = jest.fn().mockResolvedValue(mockAdmins);
  
      (usersService as any).prisma.appeal.create = mockPrismaCreateAppeal;
      (usersService as any).prisma.user.findUnique = mockPrismaFindUniqueUser;
      (usersService as any).prisma.user.findMany = mockPrismaFindManyAdmins;
  
      const mockSendAppealNotification = jest.fn().mockResolvedValue(true);
      (usersService as any).emailService.sendAppealNotificationToAdmin = mockSendAppealNotification;
  
      const result = await usersService.createAppeal('appealing-user', 'Unfair ban', 'I believe my account was banned by mistake');
  
      expect(result).toEqual({
        message: "Appeal submitted successfully",
        responseCode: 201
      });
  
      expect(mockPrismaCreateAppeal).toHaveBeenCalledWith({
        data: {
          userId: 'appealing-user',
          reason: 'Unfair ban',
          details: 'I believe my account was banned by mistake'
        }
      });
  
      expect(mockSendAppealNotification).toHaveBeenCalledTimes(2);
      expect(mockSendAppealNotification).toHaveBeenCalledWith('admin1@example.com', expect.objectContaining({
        appealId: 'appeal-123',
        userId: 'appealing-user',
        userName: 'Appealing User',
        userEmail: 'user@example.com',
        userRole: 'user',
        reason: 'Unfair ban',
        details: 'I believe my account was banned by mistake'
      }));
    });
  });
  



  describe('initiatePasswordReset', () => {
    it('should initiate password reset for an existing user', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        name: 'Test User'
      };

      const mockPrismaFindUnique = jest.fn().mockResolvedValue(mockUser);
      const mockPrismaUpdate = jest.fn().mockResolvedValue({ ...mockUser, resetToken: '12345', resetTokenExpiry: expect.any(Date) });
      (usersService as any).prisma.user.findUnique = mockPrismaFindUnique;
      (usersService as any).prisma.user.update = mockPrismaUpdate;

      const mockSendPasswordResetEmail = jest.fn().mockResolvedValue(true);
      (usersService as any).emailService.sendPasswordResetEmail = mockSendPasswordResetEmail;

      const result = await usersService.initiatePasswordReset('user@example.com');

      expect(result).toEqual({
        message: "Password reset email sent",
        responseCode: 200
      });

      expect(mockPrismaFindUnique).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
        data: expect.objectContaining({
          resetToken: expect.any(String),
          resetTokenExpiry: expect.any(Date)
        })
      });
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('user@example.com', expect.any(String));
    });

    it('should return error for non-existent user', async () => {
      const mockPrismaFindUnique = jest.fn().mockResolvedValue(null);
      (usersService as any).prisma.user.findUnique = mockPrismaFindUnique;

      const result = await usersService.initiatePasswordReset('nonexistent@example.com');

      expect(result).toEqual({
        message: "User not found",
        responseCode: 404
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password for a valid token', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'user@example.com',
        resetToken: 'valid-token',
        resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
      };

      const mockPrismaFindFirst = jest.fn().mockResolvedValue(mockUser);
      const mockPrismaUpdate = jest.fn().mockResolvedValue({ ...mockUser, password: 'new-hashed-password' });
      (usersService as any).prisma.user.findFirst = mockPrismaFindFirst;
      (usersService as any).prisma.user.update = mockPrismaUpdate;

      const result = await usersService.resetPassword('valid-token', 'newPassword123');

      expect(result).toEqual({
        message: "Password reset successful",
        responseCode: 200
      });

      expect(mockPrismaFindFirst).toHaveBeenCalledWith({
        where: {
          resetToken: 'valid-token',
          resetTokenExpiry: { gt: expect.any(Date) }
        }
      });
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        data: expect.objectContaining({
          password: expect.any(String),
          resetToken: null,
          resetTokenExpiry: null
        })
      });
    });

    it('should return error for invalid or expired token', async () => {
      const mockPrismaFindFirst = jest.fn().mockResolvedValue(null);
      (usersService as any).prisma.user.findFirst = mockPrismaFindFirst;

      const result = await usersService.resetPassword('invalid-token', 'newPassword123');

      expect(result).toEqual({
        message: "Invalid or expired reset token",
        responseCode: 400
      });
    });
  });


  describe('topUpWallet', () => {
    it('should top up user wallet successfully', async () => {
      const mockUser = {
        userId: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        wallet: 1000
      };
  
      const topUpAmount = 500;
  
      const mockPrismaUpdate = jest.fn().mockResolvedValue({
        ...mockUser,
        wallet: mockUser.wallet + topUpAmount
      });
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const result = await usersService.topUpWallet(mockUser.userId, topUpAmount);
  
      expect(result).toEqual({
        message: "Wallet topped up successfully",
        responseCode: 200,
        balance: 1500
      });
  
      expect(mockPrismaUpdate).toHaveBeenCalledWith({
        where: { userId: mockUser.userId },
        data: { wallet: { increment: topUpAmount } }
      });
    });
  
    it('should handle errors when topping up wallet', async () => {
      const mockPrismaUpdate = jest.fn().mockRejectedValue(new Error('Database error'));
      (usersService as any).prisma.user.update = mockPrismaUpdate;
  
      const result = await usersService.topUpWallet('non-existent-user', 500);
  
      expect(result).toEqual({
        message: "An error occurred while topping up the wallet",
        responseCode: 500
      });
    });
  });
  




});
