import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

let authController = new AuthController();
let auth_router = Router();
let verifytoken = verifyToken;

auth_router.post("/login", authController.userLogin);
auth_router.get("/checkDetails", verifyToken, authController.verifyToken);

export default auth_router;