import { SystemReviewService } from './services/systemReview.service';
import { PrismaClient } from '@prisma/client';
import { SystemReview } from './interfaces/reviews';

jest.mock('@prisma/client');

describe('SystemReviewService', () => {
  let systemReviewService: SystemReviewService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      systemReview: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    };
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as unknown as PrismaClient);

    systemReviewService = new SystemReviewService();
    (systemReviewService as any).Prisma = mockPrisma;
  });

  describe('createReview', () => {
    it('should create a system review successfully', async () => {
      const mockReview: SystemReview = {
        reviewId: 'mock-review-id',
        userId: 'user-123',
        comment: 'Great system!',
        rating: 5,
        createdAt: new Date('2024-07-18T18:47:41.915Z'),
      };

      mockPrisma.systemReview.findFirst.mockResolvedValue(null);
      mockPrisma.systemReview.create.mockResolvedValue(mockReview);

      const result = await systemReviewService.createReview(mockReview);

      expect(result).toEqual({
        message: "Review created successfully",
        responseCode: 201
      });
      expect(mockPrisma.systemReview.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockReview.userId,
          comment: mockReview.comment,
          rating: mockReview.rating,
          createdAt: expect.any(Date)
        })
      });
    });


    it('should return an error if the user has already created a review', async () => {
      const mockReview: SystemReview = {
        reviewId: 'mock-review-id',
        userId: 'user-123',
        comment: 'Great system!',
        rating: 5,
        createdAt: new Date(),
      };

      mockPrisma.systemReview.findFirst.mockResolvedValue({ id: 'existing-review' });

      const result = await systemReviewService.createReview(mockReview);

      expect(result).toEqual({
        message: "You have already created a review.",
        responseCode: 400
      });
    });
  });

  describe('getReviews', () => {
    it('should fetch all system reviews', async () => {
      const mockReviews = [
        { id: 'review-1', comment: 'Great system!', rating: 5 },
        { id: 'review-2', comment: 'Awesome!', rating: 4 },
      ];

      mockPrisma.systemReview.findMany.mockResolvedValue(mockReviews);

      const result = await systemReviewService.getReviews();

      expect(result).toEqual({
        message: "Reviews retrieved successfully",
        responseCode: 200,
        data: mockReviews
      });
    });
  });

  describe('getReviewsByUser', () => {
    it('should fetch all reviews for a specific user', async () => {
      const mockReviews = [
        { id: 'review-1', comment: 'Great system!', rating: 5 },
        { id: 'review-2', comment: 'Awesome!', rating: 4 },
      ];

      mockPrisma.systemReview.findMany.mockResolvedValue(mockReviews);

      const result = await systemReviewService.getReviewsByUser('user-123');

      expect(result).toEqual({
        message: "Reviews retrieved successfully",
        responseCode: 200,
        data: mockReviews
      });
      expect(mockPrisma.systemReview.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' }
      });
    });
  });
});
