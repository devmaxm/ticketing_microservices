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

async function currentUserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.session?.jwt_access
    if (!token) {
        return next()
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_KEY!) as UserPayload
    } catch (e) {}
    next()
}


export {currentUserMiddleware}
