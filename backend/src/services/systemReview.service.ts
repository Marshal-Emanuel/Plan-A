import { create } from 'domain';
import { PrismaClient } from "@prisma/client";
import { SystemReview } from "../interfaces/reviews";

export class SystemReviewService {
    Prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

/**
 * use htis interface export interface SystemReview{
    reviewId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt: 
 */

    
    async createReview(review: SystemReview) {
        try {
            const existingReview = await this.Prisma.systemReview.findFirst({
                where: {
                    userId: review.userId,
                },
            });

            if (existingReview) {
                return { message: "You have already created a review.", responseCode: 400 };
            }

            await this.Prisma.systemReview.create({
                data: {
                    userId: review.userId,
                    comment: review.comment,
                    rating: review.rating,
                    createdAt: new Date(),
                  
                }
            });
            return { message: "Review created successfully", responseCode: 201 };
        } catch (error) {
            return { message: "Please try again later.", responseCode: 500, error: error };
        }
    }

    //get all reviews
    async getReviews() {
        try {
            const reviews = await this.Prisma.systemReview.findMany();
            return { message: "Reviews retrieved successfully", responseCode: 200, data: reviews };
        } catch (error) {
            return { message: "Please try again later.", responseCode: 500, error: error };
        }

    }

    //get reviews by user id
    async getReviewsByUser(userId: string) {
        try {
            const reviews = await this.Prisma.systemReview.findMany({
                where: {
                    userId: userId
                }
            });
            return { message: "Reviews retrieved successfully", responseCode: 200, data: reviews };
        } catch (error) {
            return { message: "Please try again later.", responseCode: 500, error: error };
        }
    }
 
  
}