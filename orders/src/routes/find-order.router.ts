import {NextFunction, Request, Response, Router} from 'express'
import {ApiError, NotFoundError, requireAuthMiddleware} from "@ticketing-services/common";
import {Order} from "../models/order";

const router = Router()


router.get('/api/orders/:orderId', requireAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId)
    if (!order) {

        return next(new NotFoundError('Order not found'))
    }
    if (order.userId !== req.user!.id) {
        return next(new ApiError('Unauthorized', 401))
    }
    return res.status(200).json({order})
})



export {router as findOrderRouter}
