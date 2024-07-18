import {Request, Response} from "express"
import { UsersService } from "../services/users.service"

let service = new UsersService();

export class UsersController {
    //creating new user
    async createUser(req: Request, res: Response){
        try {
            let {name, email, phoneNumber, password, profilePicture} = req.body;
            let response = await service.createUser(req.body);
            return res.json(response);

        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);

        }
    }
    
    //view all users
    async viewAllUsers(req: Request, res: Response){
        try {
            let response = await service.viewAllUsers();
            return res.json(response);
        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);
        }
    }

  async updateUser(req: Request, res: Response){
      try {
          let userId = req.params.userId;
          let user = req.body;
          let response = await service.updateUser(userId, user);
          return res.json(response);
      }
       catch (error) {
          const err = res.json({error});
          return err;
          console.log(err);
      }
  }

  //get user by id
    async getUserById(req: Request, res: Response){
        try {
            let userId = req.params.userId;
            let response = await service.getUserById(userId);
            return res.json(response);
        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);
        }
    }

    //disable user account by setting accountStatus to banned
    async disableUser(req: Request, res: Response){
        try {
            let userId = req.params.userId;
            let response = await service.disableUser(userId);
            return res.json(response);
        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);
        }
    }

    //enable user account by setting accountStatus to active
    async enableUser(req: Request, res: Response){
        try {
            let userId = req.params.userId;
            let response = await service.enableUser(userId);
            return res.json(response);
        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);
        }
    }

    //pending user account by setting accountStatus to pending
    async managerRequest(req: Request, res: Response){
        try {
            let userId = req.params.userId;
            let response = await service.managerRequest(userId);
            return res.json(response);
        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);
        }
    }

    //verifyying user account status
    async verifyAccount(req: Request, res: Response){
        try {
            let userId = req.params.userId;
            let response = await service.verifyAccount(userId);
            return res.json(response);
        } catch (error) {
            const err = res.json({error});
            return err;
            console.log(err);
        }
    }

    //create appeal
    async createAppeal(req: Request, res: Response) {
        try {
            const { userId, reason, details } = req.body;
            const response = await service.createAppeal(userId, reason, details);
            return res.status(response.responseCode).json(response);
        } catch (error) {
            console.error("Error in createAppeal controller:", error);
            return res.status(500).json({
                message: "An unexpected error occurred while processing the appeal.",
                error: error
            });
        }
    }


    //apassword reset
    async initiatePasswordReset(req: Request, res: Response) {
        const { email } = req.body;
        const result = await service.initiatePasswordReset(email);
        res.status(result.responseCode).json(result);
    }
    
    async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;
        const result = await service.resetPassword(token, newPassword);
        res.status(result.responseCode).json(result);
    }
    
    



}