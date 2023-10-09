import {Router} from 'express'
import {requireAuthMiddleware} from "../middlewares/require-auth.middleware";
import {currentUserMiddleware} from "../middlewares/current-user.middleware";

const router = Router()

router.get('/api/users/currentuser', currentUserMiddleware, requireAuthMiddleware, (req, res, next) => {
    res.status(200).json({user: req.user})
})

export {router as currentUserRouter}
