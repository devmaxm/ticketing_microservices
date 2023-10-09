import {Router} from 'express'
import {requireAuthMiddleware} from "../middlewares/require-auth.middleware";
import {currentUserMiddleware} from "../middlewares/current-user.middleware";

const router = Router()

router.post('/api/users/signout', currentUserMiddleware, requireAuthMiddleware, (req, res, next) => {
    req.session = null

    res.json({})
})

export {router as signOutRouter}
