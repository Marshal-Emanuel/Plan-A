import { EmailService } from '../services/email.service';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import { Reservation } from '../interfaces/reservation';
import { Event } from '../interfaces/events';



jest.mock('nodemailer');
jest.mock('@prisma/client');
jest.mock('qrcode');

describe('EmailService', () => {
  let emailService: EmailService;
  let mockTransporter: any;
  let mockPrisma: any;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ response: 'Email sent' }),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    mockPrisma = {
      reservation: {
        findUnique: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      event: {
        findUnique: jest.fn(),
      },
    };
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as unknown as PrismaClient);

    emailService = new EmailService();
    (emailService as any).prisma = mockPrisma;
  });

  describe('sendWelcomeEmail', () => {
    it('should send a welcome email successfully', async () => {
      const to = 'test@example.com';
      const userName = 'Test User';

      const result = await emailService.sendWelcomeEmail(to, userName);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        from: process.env.GMAIL_USER,
        to: to,
        subject: 'Welcome to PLAN-A',
        html: expect.stringContaining(`Welcome to PLAN-A, ${userName}!`)
      }));
    });
  });

  describe('sendReservationConfirmation', () => {
    it('should send a reservation confirmation email successfully', async () => {
      const reservationId = 'res-123';
      const mockReservation = {
        event: { name: 'Test Event', date: new Date(), time: new Date(), location: 'Test Location' },
        user: { name: 'Test User', email: 'test@example.com' },
        isRegular: true,
        numberOfPeople: 2,
      };
      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);
      (QRCode.toDataURL as jest.Mock).mockResolvedValue('mock-qr-code-data-url');

      const result = await emailService.sendReservationConfirmation(reservationId);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'test@example.com',
        subject: 'Event Reservation Confirmation',
        html: expect.stringContaining('Your reservation for the event "Test Event" has been confirmed.')
      }));
    });
  });

  describe('sendNewEventNotification', () => {
    it('should send a new event notification email successfully', async () => {
      const userId = 'user-123';
      const eventId = 'event-123';
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      const mockEvent = { name: 'New Event', description: 'Test Description', date: new Date(), time: new Date(), location: 'Test Location' };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

      const result = await emailService.sendNewEventNotification(userId, eventId);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: 'test@example.com',
        subject: 'New Event Announcement: New Event',
        html: expect.stringContaining('We\'re excited to announce a new event!')
      }));
    });
  });


  describe('sendNewEventAdminNotification', () => {
    it('should send a new event admin notification email successfully', async () => {
      const adminEmail = 'admin@example.com';
      const eventId = 'event-123';
      const eventName = 'New Event';

      const result = await emailService.sendNewEventAdminNotification(adminEmail, eventId, eventName);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: adminEmail,
        subject: 'New Event Requires Approval: New Event',
        html: expect.stringContaining('A new event "New Event" has been created and requires your approval.')
      }));
    });
  });

  describe('sendEventApprovalNotification', () => {
    it('should send an event approval notification email successfully', async () => {
      const managerEmail = 'manager@example.com';
      const eventName = 'Approved Event';

      const result = await emailService.sendEventApprovalNotification(managerEmail, eventName);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: managerEmail,
        subject: 'Your Event Has Been Approved: Approved Event',
        html: expect.stringContaining('Your event "Approved Event" has been approved.')
      }));
    });
  });

  describe('sendEventRejectionNotification', () => {
    it('should send an event rejection notification email successfully', async () => {
      const managerEmail = 'manager@example.com';
      const eventName = 'Rejected Event';

      const result = await emailService.sendEventRejectionNotification(managerEmail, eventName);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: managerEmail,
        subject: 'Your Event Has Been Rejected: Rejected Event',
        html: expect.stringContaining('We regret to inform you that your event "Rejected Event" has been rejected.')
      }));
    });
  });

  describe('sendEventCancellationNotification', () => {
    it('should send an event cancellation notification email successfully', async () => {
      const userEmail = 'user@example.com';
      const eventName = 'Cancelled Event';
      const managerName = 'Test Manager';
      const managerEmail = 'manager@example.com';
      const managerPhone = '1234567890';

      const result = await emailService.sendEventCancellationNotification(userEmail, eventName, managerName, managerEmail, managerPhone);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: userEmail,
        subject: 'Event Cancellation Notice: Cancelled Event',
        html: expect.stringContaining('We regret to inform you that the event "Cancelled Event" has been cancelled.')
      }));
    });
  });

  describe('sendEventUpdateNotification', () => {
    it('should send an event update notification email successfully', async () => {
      const userEmail = 'user@example.com';
      const eventName = 'Updated Event';
      const managerName = 'Test Manager';
      const managerEmail = 'manager@example.com';
      const managerPhone = '1234567890';
      const updatedEvent: Event = {
        name: 'Updated Event Name',
        description: 'Updated Description',
        moreInfo: 'Additional Info',
        location: 'New Location',
        date: new Date(),
        time: new Date(),
        numberOfTickets: 200,
        remainingTickets: 200,
        managerId: 'manager-123',
        image: 'http://example.com/updated-image.jpg',
        hasRegular: true,
        regularPrice: 50,
        hasVIP: true,
        vipPrice: 100,
        hasChildren: false,
        childrenPrice: 0,
        isPromoted: false,
        promoDetails: "fre events update",
        status: 'ACTIVE',
        nature: 'PENDING'
      };


      const result = await emailService.sendEventUpdateNotification(userEmail, eventName, managerName, managerEmail, managerPhone, updatedEvent);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: userEmail,
        subject: 'Event Update: Updated Event',
        html: expect.stringContaining('The event "Updated Event" has been updated.')
      }));
    });
  });

  describe('sendNewReservationNotification', () => {
    it('should send a new reservation notification email successfully', async () => {
      const recipientEmail = 'recipient@example.com';
      const reservation: Reservation = {
        eventId: 'event-123',
        userId: 'user-123',
        user: { name: 'Test User' },
        isRegular: true,
        isVIP: false,
        isChildren: false,
        numberOfPeople: 2,
        paidAmmount: 100,
        proxyName: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const event: Event = {
        managerId: 'manager-123',
        name: 'Test Event',
        description: 'Event description',
        moreInfo: 'More information',
        location: 'Event Location',
        date: new Date(),
        time: new Date(),
        numberOfTickets: 100,
        remainingTickets: 98,
        image: 'image-url',
        hasRegular: true,
        regularPrice: 50,
        hasVIP: false,
        vipPrice: 0,
        hasChildren: false,
        childrenPrice: 0,
        isPromoted: false,
        status: 'ACTIVE',
        nature: 'APPROVED',

      };


      const result = await emailService.sendNewReservationNotification(recipientEmail, reservation, event);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: recipientEmail,
        subject: 'New Reservation for Test Event',
        html: expect.stringContaining('A new reservation has been made:')
      }));
    });
  });

  describe('sendAccountDisabledNotification', () => {
    it('should send an account disabled notification email successfully', async () => {
      const userEmail = 'user@example.com';
      const userName = 'Test User';

      const result = await emailService.sendAccountDisabledNotification(userEmail, userName);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: userEmail,
        subject: 'Important Notice: Your PLAN-A Account Status',
        html: expect.stringContaining('We regret to inform you that your account on PLAN-A has been temporarily disabled')
      }));
    });
  });

  describe('sendAccountReactivatedNotification', () => {
    it('should send an account reactivated notification email successfully', async () => {
      const userEmail = 'user@example.com';
      const userName = 'Test User';

      const result = await emailService.sendAccountReactivatedNotification(userEmail, userName);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: userEmail,
        subject: 'Welcome Back! Your PLAN-A Account Has Been Reactivated',
        html: expect.stringContaining('We are pleased to inform you that your PLAN-A account has been successfully reactivated.')
      }));
    });
  });

  describe('sendAppealNotificationToAdmin', () => {
    it('should send an appeal notification to admin successfully', async () => {
      const adminEmail = 'admin@example.com';
      const appealDetails = {
        userId: 'user-123',
        userName: 'Test User',
        userEmail: 'user@example.com',
        userRole: 'user',
        appealId: 'appeal-123',
        reason: 'Test Reason',
        details: 'Test Details',
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendAppealNotificationToAdmin(adminEmail, appealDetails);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: adminEmail,
        subject: 'New User Appeal Submitted - Action Required',
        html: expect.stringContaining('A new appeal has been submitted.')
      }));
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send a password reset email successfully', async () => {
      const email = 'user@example.com';
      const resetCode = '123456';

      const result = await emailService.sendPasswordResetEmail(email, resetCode);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: 'Password Reset Request - PLAN-A',
        html: expect.stringContaining('You have requested to reset your password.')
      }));
    });
  });
});
