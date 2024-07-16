import { PrismaClient } from "@prisma/client";
import { Review } from "../interfaces/reviews";

export class ReviewsService {
    prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

    async createReview(review: Review) {
        try {
            const existingReview = await this.prisma.review.findFirst({
                where: {
                    reviewId: review.userId,
                },
            });

            if (existingReview) {
                return { message: "You have already created a review.", responseCode: 400 };
            }

            await this.prisma.review.create({
                data: {
                    userId: review.userId,
                    comment: review.comment,
                    rating: review.rating,
                    createdAt: new Date(),
                    eventId: review.eventId
                }
            });
            return { message: "Review created successfully", responseCode: 201 };
        } catch (error) {
            return { message: "Please try againlater.", responseCode: 500, error: error };
        }
    }

    async getReviews() {
        try {
            let reviews = await this.prisma.review.findMany();

            return {
                responseCode: 200,
                data: reviews
            };

        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //get one review
    async getReview(reviewId: string) {
        try {
            const review = await this.prisma.review.findUnique({
                where: {
                    reviewId: reviewId
                }
            });

            if (!review) {
                return {
                    message: "Review not found",
                    responseCode: 404
                };
            }

            return {
                responseCode: 200,
                data: review
            };

        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }
    
    //get review by event id
    async getReviewsByEvent(eventId: string) {
        try {
            let reviews = await this.prisma.review.findMany({
                where: {
                    eventId: eventId
                }
            });

            return {
                responseCode: 200,
                data: reviews
            };

        } catch (error) {
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    //update review
    
    
}