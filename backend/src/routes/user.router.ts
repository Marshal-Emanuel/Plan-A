import Router from 'express';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';
import { verifyToken, isAdmin, isUser } from '../middlewares/verifyToken';


const user_router = Router();
const userController = new UsersController();
const authController = new AuthController();

user_router.post('/register', userController.createUser);
user_router.get('/allUsers',verifyToken,isAdmin, userController.viewAllUsers);
user_router.put('/updateUser/:userId', verifyToken, userController.updateUser);
user_router.get('/getUser/:userId', userController.getUserById);
user_router.put('/disableUser/:userId',verifyToken,isAdmin, userController.disableUser);
user_router.put('/enableUser/:userId', verifyToken,isAdmin,userController.enableUser);
user_router.put('/managerRequest/:userId',verifyToken,isUser, userController.managerRequest);
user_router.put('/approveRequest/:userId',verifyToken, isAdmin, userController.verifyAccount);
user_router.post('/appeal', verifyToken, userController.createAppeal);
user_router.post('/forgot-password', userController.initiatePasswordReset);
user_router.post('/reset-password', userController.resetPassword);


export default user_router;