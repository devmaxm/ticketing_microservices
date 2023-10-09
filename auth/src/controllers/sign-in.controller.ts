import {NextFunction, Request, Response} from "express";
import {User} from "../models/user";
import {IUser} from "../interfaces/user.interface";
import ApiError from "../errors/api.error";
import {Password} from "../services/password";
import jwt from "jsonwebtoken";

export async function signInController (req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body
    const user = await User.findOne({email}).exec() as IUser | null
    if (!user) {
        return next(new ApiError('Invalid user data', 400))
    }
    const isCorrectPassword = await Password.compare(user.password, password)
    if (!isCorrectPassword) {
        return next(new ApiError('Invalid user data', 400))
    }
    const jwt_access = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_KEY!
    )
    req.session = {
        jwt_access
    }

    res.status(200).json({user})
}
