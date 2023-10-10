import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken'

import {ApiError} from "@ticketing-services/common";

import {User} from '../models/user'


export async function signUpController(req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body
    const isUserExist = await User.findOne({email})
    if (isUserExist) {
        return next(new ApiError('User with this email is already exists', 400))
    }
    const user = User.build({email, password})
    await user.save()
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

    res.status(201).json({user})
}
