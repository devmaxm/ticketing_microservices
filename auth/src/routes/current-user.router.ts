import {Router} from 'express'
import {requireAuthMiddleware, currentUserMiddleware} from "@ticketing-services/common";

const router = Router()

router.get('/api/users/currentuser', currentUserMiddleware, (req, res) => {
    res.status(200).json({currentUser: req.user || null})
})

export {router as currentUserRouter}
