import { PrismaClient, Prisma } from "@prisma/client";
import {User} from "../interfaces/users";
import * as bcrypt from "bcrypt";
import { EmailService } from "./email.service";

// const prisma = new PrismaClient();

export class UsersService {

    prisma = new PrismaClient(
        {log: ['query', 'info', 'warn', 'error']}
    );

    private emailService: EmailService = new EmailService();

    constructor(){
        this.emailService = new EmailService();
    }


    //create a new user
    async createUser(user: User) {
        const bcryptPassword = await bcrypt.hash(user.password, 10);
    
        try {
          const createdUser = await this.prisma.user.create({
            data: {
              name: user.name,
              phoneNumber: user.phoneNumber,
              email: user.email,
              password: bcryptPassword,
              profilePicture: user.profilePicture,              
            }
          });
    
          // Send welcome email
          await this.emailService.sendEmail(
            createdUser.email,
            'Welcome to Our Platform',
            `Hello ${createdUser.name},\n\nWelcome to our event management platform. We're excited to have you on board!`
          );
    
          return {
            message: "User created successfully",
            responseCode: 201
          };
        }
        catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
              return {
                message: "Account already exists",
                responseCode: 400
              };
            }
          }
          return {
            message: "An unexpected error occurred.",
            responseCode: 500
          };
        }
      }

 async viewAllUsers() {
    const users = await this.prisma.user.findMany();
    return users;
}

async updateUser(userId: string, user: User) {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const updatedUser = await this.prisma.user.update({
            where: {
                userId: userId},
                data:{
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    password: hashedPassword,
                    profilePicture: user.profilePicture
                }
            });
            return{
                message: "Details updated Succesfuly",
                responseCode: 200,                
            }
            
    } catch (error) {
        return{
            message: "Error updating details occurred.",
            responseCode: 500,
            error: error
        }
    }
}

    //get user by id
    async getUserById(userId: string){
        const user = await this.prisma.user.findUnique({
            where: {
                userId: userId
            }
        });
        return user;
    }

    //disable user account by setting accountStatus to banned
    async disableUser(userId: string){
        try {
            const user = await this.prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    accountStatus: "banned"
                }
            });
            return {
                message: "User account disabled",
                responseCode: 200
            }
        } catch (error) {
            return {
                message: "User not found.",
                responseCode: 500,
                error: error
            }
        }
    }

    // enable user account by setting accountStatus to active
    async enableUser(userId: string){
        try {
            const user = await this.prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    accountStatus: "active"
                }
            });
            return {
                message: "User account enabled",
                responseCode: 200
            }
        } catch (error) {
            return {
                message: "User not found.",
                responseCode: 500,
                error: error
            }
        }
    }

    //set pend user account
    async managerRequest(userId: string){
        try {
            const user = await this.prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    accountStatus: "pending"
                }
            });
            return {
                message: "Request for Account upgrade sent",
                responseCode: 200
            }
        } catch (error) {
            return {
                message: "Error sending request",
                responseCode: 500,
                error: error
            }
        }
    }

    //verify account
    async verifyAccount(userId: string){
        try {
            const user = await this.prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    accountStatus: "verified"
                }
            });
            return {
                message: "Account verified",
                responseCode: 200
            }
        } catch (error) {
            return {
                message: "Error verifying account",
                responseCode: 500,
                error: error
            }
        }
    }
   
    
}