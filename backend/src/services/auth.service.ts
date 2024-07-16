import { resolve } from 'path';
import { PrismaClient } from "@prisma/client";
import { UserLogin } from "../interfaces/users";
import jwt from "jsonwebtoken";
import { Response } from "express";
import bcrypt from "bcrypt";

export class AuthService{
    prisma = new PrismaClient({
        log: ['error', 'info', 'query',]
    });

    async userLogin(user: UserLogin){
        const userExists = await this.prisma.user.findFirst({
            where: {
                email: user.email,       
            }
        });

        if(!userExists){
            return {
                error: true,
                message: "User not found"
            }
        }

        // const passwordMatch = userExists.password === user.password;
        const passwordMatch = await bcrypt.compare(user.password, userExists.password);

        console.log("Password match",passwordMatch);
        
        if(!passwordMatch){
            return {
                error: true,
                message: "Invalid password"
            }
        }

        const token = await this.createToken(userExists.userId, userExists.email, userExists.role);

            return{
                message: "Login successful",
                responseCode: 200,
                token: token,
                role: userExists.role
            }
    }

    private async createToken(userId: string, email: string, role: string){
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({userId, email, role}, secretKey as string, {expiresIn: '1h'});

        return token
    
}
}

