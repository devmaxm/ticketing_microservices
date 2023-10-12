import {NextFunction, Request, Response, Router} from 'express'
import {requireAuthMiddleware} from "@ticketing-services/common";
import {Order} from "../models/order";

const router = Router()

router.get('/api/orders', requireAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({userId: req.user!.id})
        .populate('ticket')
    res.status(200).json({orders})
})

export {router as allOrdersRouter}
