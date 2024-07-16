import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ExtendedRequest } from "../middlewares/verifyToken";


let authService = new AuthService();

export class AuthController{
    async userLogin(req: Request, res: Response){
        const user = req.body;
        const response = await authService.userLogin(user);

        if(response.error){
            return res.status(404).json(response);
        }

        return res.status(200).json(response);
    }

    async userLogout(req: Request, res: Response){
        return res.status(200).json({
            message: "Logout successful"
        })
    }



    async verifyToken(req: ExtendedRequest, res: Response){
        try {
            if(req.info){
                return res.status(201).json({
                    info: req.info
                })
            }
        } catch (error) {
            return res.status(500).json({error})
        }
    }
}
