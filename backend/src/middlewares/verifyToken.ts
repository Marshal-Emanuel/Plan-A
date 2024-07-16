import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { tokenInfo } from "../interfaces/users";

export interface ExtendedRequest extends Request {
    info?: tokenInfo;
}

export const verifyToken = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.headers['token'] as string;

    if (!token) {
        return res.status(401).json({ error: "Access denied. Please log in again." });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        return res.status(500).json({ error: "Server configuration error." });
    }

    try {
        const data = jwt.verify(token, secretKey) as tokenInfo;
        req.info = data;
        next();
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Action disabled temporarily, login again to continue enjoying our services." });
        }
        return res.status(401).json({ error: "Invalid token. Please log in again." });
    }
};

export const isAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.info?.role !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
    next();
};

export const isManager = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.info?.role !== 'manager') {
        return res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
    next();
}

export const isUser = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.info?.role !== 'user') {
        return res.status(403).json({ error: 'You are not authorized to perform this operation.' });
    }
    next();
}