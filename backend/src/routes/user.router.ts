import Router from 'express';
import { UsersController } from '../controllers/users.controller';

const user_router = Router();
const userController = new UsersController();

user_router.post('/register', userController.createUser);
user_router.get('/allUsers', userController.viewAllUsers);
user_router.put('/updateUser/:userId', userController.updateUser);
user_router.get('/getUser/:userId', userController.getUserById);
user_router.put('/disableUser/:userId', userController.disableUser);
user_router.put('/enableUser/:userId', userController.enableUser);
user_router.put('/managerRequest/:userId', userController.managerRequest);
user_router.put('/approveRequest/:userId', userController.verifyAccount);


export default user_router;