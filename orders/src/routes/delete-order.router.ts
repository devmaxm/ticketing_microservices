import {NextFunction, Request, Response, Router} from 'express'
import {ApiError, NotFoundError, OrderStatus, requireAuthMiddleware} from "@ticketing-services/common";
import {Order} from "../models/order";
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled.publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router()


router.delete('/api/orders/:orderId', requireAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')
    if (!order) {
        return next(new NotFoundError('Order not found'))
    }

    if (order.userId !== req.user!.id) {
        return next(new ApiError('Unauthorized', 401))
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })
    return res.status(204).json({order})
})



export {router as deleteOrderRouter}
