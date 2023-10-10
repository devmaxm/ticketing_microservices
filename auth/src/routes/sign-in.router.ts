import {Router} from 'express'
import {body} from 'express-validator'
import {signInController} from "../controllers/sign-in.controller";
import {requestValidateMiddleware} from "@ticketing-services/common";

const router = Router()

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Provide correct email'),
    body('password').notEmpty().withMessage('Please supply password')
], requestValidateMiddleware, signInController)

export {router as signInRouter}
