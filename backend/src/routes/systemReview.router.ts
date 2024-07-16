import { Router } from "express";
import { SystemReviewController } from "../controllers/systemReview.controller";
import { verifyToken } from "../middlewares/verifyToken";

const systemReview_router = Router();
const systemReviewController = new SystemReviewController();

systemReview_router.post('/createReview',verifyToken, systemReviewController.createReview);
systemReview_router.get('/getReviews', systemReviewController.getReviews);
systemReview_router.get('/getReview/:userId', systemReviewController.getReviewsByUser);


export default systemReview_router;

