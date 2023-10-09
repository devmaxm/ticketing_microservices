import {NextFunction, Request, Response} from "express";
import ApiError from "../errors/api.error";
import jwt from "jsonwebtoken";


interface UserPayload {
    id: string;
    email: string
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

async function requireAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        next(new ApiError('Unauthorized', 401))
    }
    next()
}


export {requireAuthMiddleware}
