import { PrismaClient, Prisma } from "@prisma/client";
import {User} from "../interfaces/users";
import * as bcrypt from "bcrypt";
import { EmailService } from "./email.service";
import * as crypto from "crypto";

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
                    isSubscribedToMails: user.isSubscribedToMails              
                }
            });
    
            // Trigger welcome email asynchronously
            this.sendWelcomeEmail(createdUser).catch(console.error);
    
            return {
                message: "User created successfully",
                responseCode: 201,
                userId: createdUser.userId
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return {
                    message: "Account already exists",
                    responseCode: 400
                };
            }
            return {
                message: "An unexpected error occurred.",
                responseCode: 500
            };
        }
    }
    
    private async sendWelcomeEmail(user: User) {
        await this.emailService.sendEmail(
            user.email,
            'Welcome to Our Platform',
            `Hello ${user.name},\n\nWelcome to our event management platform. We're excited to have you on board!`
        );
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
    async disableUser(userId: string) {
        try {
            const user = await this.prisma.user.update({
                where: { userId: userId },
                data: { accountStatus: "banned" }
            });
    
            // Trigger account disabled notification asynchronously
            this.sendAccountDisabledNotification(user).catch(console.error);
    
            return {
                message: "User account disabled successfully",
                responseCode: 200
            };
        } catch (error) {
            console.error("Error disabling user account:", error);
            return {
                message: "An error occurred while disabling the user account.",
                responseCode: 500,
                error: error
            };
        }
    }    

    private async sendAccountDisabledNotification(user: User) {
        await this.emailService.sendAccountDisabledNotification(user.email, user.name);
    }
    
    

    async enableUser(userId: string) {
        try {
            const user = await this.prisma.user.update({
                where: { userId: userId },
                data: { accountStatus: "active" }
            });
    
            // Trigger account reactivation notification asynchronously
            this.sendAccountReactivatedNotification(user).catch(console.error);
    
            return {
                message: "User account enabled successfully",
                responseCode: 200
            };
        } catch (error) {
            console.error("Error enabling user account:", error);
            return {
                message: "An error occurred while enabling the user account.",
                responseCode: 500,
                error: error
            };
        }
    }
    
    private async sendAccountReactivatedNotification(user: User) {
        await this.emailService.sendAccountReactivatedNotification(user.email, user.name);
    }
    
    

    async managerRequest(userId: string) {
        try {
            const user = await this.prisma.user.update({
                where: { userId: userId },
                data: { accountStatus: "pending" }
            });
    
            // Fetch all admin users
            const adminUsers = await this.prisma.user.findMany({ where: { role: 'admin' } });
    
            // Send notification to each admin asynchronously
            adminUsers.forEach(admin => {
                this.emailService.sendManagerRequestNotification(admin.email, user).catch(console.error);
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
    async verifyAccount(userId: string) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    userId: userId
                },
                data: {
                    accountStatus: "verified",
                    role: "manager"
                }
            });
    
            // Send verification approval email asynchronously
            this.emailService.sendAccountVerificationEmail(user.email, user.name).catch(console.error);
    
            return {
                message: "Account verified, role set to manager, and notification sent",
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
    
    


    //making an appeal
    async createAppeal(userId: string, reason: string, details: string) {
        try {
            const appeal = await this.prisma.appeal.create({
                data: {
                    userId,
                    reason,
                    details
                }
            });
    
            const user = await this.prisma.user.findUnique({ 
                where: { userId },
                select: {
                    userId: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
    
            if (user) {
                const adminUsers = await this.prisma.user.findMany({ where: { role: 'admin' } });
                adminUsers.forEach(admin => {
                    this.emailService.sendAppealNotificationToAdmin(admin.email, {
                        appealId: appeal.appealId,
                        userId: user.userId,
                        userName: user.name,
                        userEmail: user.email,
                        userRole: user.role,
                        reason: appeal.reason,
                        details: appeal.details,
                        createdAt: appeal.createdAt
                    }).catch(console.error);
                });
            }
    
            return {
                message: "Appeal submitted successfully",
                responseCode: 201
            };
        } catch (error) {
            console.error("Error creating appeal:", error);
            return {
                message: "An error occurred while submitting the appeal.",
                responseCode: 500
            };
        }
    }
    

    //password reset
    async initiatePasswordReset(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: "User not found", responseCode: 404 };
        }
    
        const resetToken = crypto.randomInt(10000, 99999).toString();
        const resetTokenExpiry = new Date(Date.now() + 3600000);
    
        await this.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry }
        });
    
        // Send reset email asynchronously
        this.emailService.sendPasswordResetEmail(email, resetToken).catch(console.error);
    
        return { message: "Password reset email sent", responseCode: 200 };
    }
    
    
    async resetPassword(token: string, newPassword: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });
    
        if (!user) {
            return { message: "Invalid or expired reset token", responseCode: 400 };
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await this.prisma.user.update({
            where: { userId: user.userId },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
    
        return { message: "Password reset successful", responseCode: 200 };
    }


    //top up wallet
    async topUpWallet(userId: string, amount: number) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { userId },
                data: { wallet: { increment: amount } }
            });
    
            return {
                message: "Wallet topped up successfully",
                responseCode: 200,
                balance: updatedUser.wallet
            };
        } catch (error) {
            console.error("Error topping up wallet:", error);
            return {
                message: "An error occurred while topping up the wallet",
                responseCode: 500
            };
        }
    }

    async getUserBalance(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { userId: userId },
                select: { wallet: true }
            });
            if (!user) {
                return { message: "User not found", responseCode: 404 };
            }
            return { balance: user.wallet, responseCode: 200 };
        } catch (error) {
            console.error("Error fetching user balance:", error);
            return { message: "An unexpected error occurred.", responseCode: 500, error: error };
        }
    }

    
    
    //get users count where role is admin  and manager, retunrn number for each
    //get users count where role is admin and manager, return number for each
    async getUsersCountByRole() {
        try {
            const adminCount = await this.prisma.user.count({
                where: { role: 'admin' }
            });

            const managerCount = await this.prisma.user.count({
                where: { role: 'manager' }
            });

            return {
                adminCount,
                managerCount
            };
        } catch (error) {
            console.error("Error fetching users count:", error);
            return {
                message: "An error occurred while fetching users count.",
                responseCode: 500,
                error: error
            };
        }
    }


    async getPendingUsers() {
        try {
            const pendingUsers = await this.prisma.user.findMany({
                where: { accountStatus: 'pending' }
            });
    
            return {
                message: "Pending users retrieved successfully",
                responseCode: 200,
                users: pendingUsers
            };
        } catch (error) {
            console.error("Error fetching pending users:", error);
            return {
                message: "An error occurred while fetching pending users.",
                responseCode: 500,
                error: error
            };
        }
    }
    
    
    
    
   
    
}