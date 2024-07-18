import { ReviewsService } from '@/services/reviews.service';
import { PrismaClient } from '@prisma/client';
import { Review } from '@/interfaces/reviews';

jest.mock('@prisma/client');

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      review: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    (PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma as unknown as PrismaClient);

    reviewsService = new ReviewsService();
    (reviewsService as any).prisma = mockPrisma;
  });

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      const mockReview: Review = {
        userId: 'user-123',
        eventId: 'event-123',
        comment: 'Great event!',
        rating: 5,
        reviewId: '',
        createdAt: new Date()
      };

      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue({
        ...mockReview,
        reviewId: 'generated-review-id',
        createdAt: expect.any(Date)
      });

      const result = await reviewsService.createReview(mockReview);

      expect(result).toEqual({
        message: "Review created successfully",
        responseCode: 201
      });
      expect(mockPrisma.review.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockReview.userId,
          eventId: mockReview.eventId,
          comment: mockReview.comment,
          rating: mockReview.rating,
          createdAt: expect.any(Date)
        })
      });
    });

    it('should return an error if the user has already created a review', async () => {
      const mockReview: Review = {
        userId: 'user-123',
        eventId: 'event-123',
        comment: 'Great event!',
        rating: 5,
        reviewId: '',
        createdAt: new Date()
      };

      mockPrisma.review.findFirst.mockResolvedValue({ reviewId: 'existing-review' });

      const result = await reviewsService.createReview(mockReview);

      expect(result).toEqual({
        message: "You have already created a review.",
        responseCode: 400
      });
    });
  });

  describe('getReviews', () => {
    it('should fetch all reviews', async () => {
      const mockReviews = [
        { reviewId: 'review-1', comment: 'Great event!', rating: 5 },
        { reviewId: 'review-2', comment: 'Awesome!', rating: 4 },
      ];

      mockPrisma.review.findMany.mockResolvedValue(mockReviews);

      const result = await reviewsService.getReviews();

      expect(result).toEqual({
        responseCode: 200,
        data: mockReviews
      });
    });
  });

  describe('getReview', () => {
    it('should fetch a single review', async () => {
      const mockReview = { reviewId: 'review-1', comment: 'Great event!', rating: 5 };

      mockPrisma.review.findUnique.mockResolvedValue(mockReview);

      const result = await reviewsService.getReview('review-1');

      expect(result).toEqual({
        responseCode: 200,
        data: mockReview
      });
    });

    it('should return a 404 if review is not found', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);

      const result = await reviewsService.getReview('non-existent-review');

      expect(result).toEqual({
        message: "Review not found",
        responseCode: 404
      });
    });
  });

  describe('getReviewsByEvent', () => {
    it('should fetch all reviews for a specific event', async () => {
      const mockReviews = [
        { reviewId: 'review-1', comment: 'Great event!', rating: 5 },
        { reviewId: 'review-2', comment: 'Awesome!', rating: 4 },
      ];

      mockPrisma.review.findMany.mockResolvedValue(mockReviews);

      const result = await reviewsService.getReviewsByEvent('event-123');

      expect(result).toEqual({
        responseCode: 200,
        data: mockReviews
      });
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith({
        where: { eventId: 'event-123' }
      });
    });
  });
});
