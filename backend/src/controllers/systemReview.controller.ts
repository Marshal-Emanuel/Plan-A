import {Request, Response} from 'express';
import {SystemReviewService} from '../services/systemReview.service';

let systemReviewService = new SystemReviewService();

export class SystemReviewController {
    async createReview(req: Request, res: Response) {
        let review = {
            reviewId: req.body.reviewId,
            userId: req.body.userId,
            comment: req.body.comment,
            rating: req.body.rating,
            createdAt: new Date()
        };

        let response = await systemReviewService.createReview(review);
        return res.status(response.responseCode).json(response);
    }

    async getReviews(req: Request, res: Response) {
        let response = await systemReviewService.getReviews();
        return res.status(response.responseCode).json(response);
    }


    async getReviewsByUser(req: Request, res: Response) {
        let userId = req.params.userId;
        let response = await systemReviewService.getReviewsByUser(userId);
        return res.status(response.responseCode).json(response);
    }
}