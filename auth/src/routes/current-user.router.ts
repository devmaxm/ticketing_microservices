import {Router} from 'express'
import {requireAuthMiddleware, currentUserMiddleware} from "@ticketing-services/common";

const router = Router()

router.get('/api/users/currentuser', currentUserMiddleware, requireAuthMiddleware, (req, res) => {
    res.status(200).json({currentUser: req.user})
})

export {router as currentUserRouter}
