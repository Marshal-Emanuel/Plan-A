import { Router } from "express";
import { ReviewsController } from "../controllers/reviews.controller";
import { verifyToken, isManager, isAdmin, ExtendedRequest } from "../middlewares/verifyToken";

const reviews_router = Router();
const reviewsController = new ReviewsController();

reviews_router.post('/createReview', verifyToken, reviewsController.createReview);
reviews_router.get('/getReviews', reviewsController.getReviews);
reviews_router.get('/getReview/:reviewId', reviewsController.getReview);
// reviews_router.put('/updateReview', verifyToken, reviewsController.updateReview);
reviews_router.get('/getReviewsByEvent/:eventId', reviewsController.getReviewsByEvent);



export default reviews_router;