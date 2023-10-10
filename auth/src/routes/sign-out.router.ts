import {Router} from 'express'
import {requireAuthMiddleware, currentUserMiddleware} from "@ticketing-services/common";

const router = Router()

router.post('/api/users/signout', currentUserMiddleware, requireAuthMiddleware, (req, res, next) => {
    req.session = null

    res.json({})
})

export {router as signOutRouter}
