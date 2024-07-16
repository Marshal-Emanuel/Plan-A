import { Request, Response } from "express";
import { ReviewsService } from "../services/reviews.service";
import { Review } from "../interfaces/reviews";
import { create } from "domain";

let reviewsService = new ReviewsService();

export class ReviewsController {

    //creating review
    async createReview(req: Request, res: Response) {
        let review: Review = {
            reviewId: req.body.reviewId,
            userId: req.body.userId,
            comment: req.body.comment,
            rating: req.body.rating,
            createdAt: new Date(),
            eventId: req.body.eventId
        };

        let response = await reviewsService.createReview(review);
        return res.status(response.responseCode).json(response);
    }

    async getReviews(req: Request, res: Response) {
        let response = await reviewsService.getReviews();
        return res.status(response.responseCode).json(response);
    }

    async getReview(req: Request, res: Response) {
        let reviewId = req.params.reviewId;
        let response = await reviewsService.getReview(reviewId);
        return res.status(response.responseCode).json(response);
    }

   //get review by eventId
    async getReviewsByEvent(req: Request, res: Response) {
        let eventId = req.params.eventId;
        let response = await reviewsService.getReviewsByEvent(eventId);
        return res.status(response.responseCode).json(response);
    }

    //update review
    
}
