import {Router} from 'express'
import {body} from 'express-validator'
import {signUpController} from '../controllers/sign-up.controller'
import {requestValidateMiddleware} from "../middlewares/request-validate.middleware";

const router = Router()


router.post('/api/users/signup', [
        body('email').isEmail().withMessage('Provide correct email'),
        body('password')
            .isString()
            .isLength({min: 4, max: 20})
            .withMessage('Password must be between 4 and 20 characters')
    ], requestValidateMiddleware, signUpController
)

export {router as signUpRouter}
