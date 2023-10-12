import {NextFunction, Request, Response, Router} from 'express'
import {body} from 'express-validator'
import {
    ApiError,
    NotFoundError,
    OrderStatus,
    requestValidateMiddleware,
    requireAuthMiddleware
} from "@ticketing-services/common";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created.publisher';

const router = Router()

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders',
    [
        body('ticketId').isString().notEmpty().withMessage('Field ticketId must be a string')
    ],
    requireAuthMiddleware, requestValidateMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const {ticketId} = req.body
        const ticket = await Ticket.findById(ticketId)
        if (!ticket) {
            return next(new NotFoundError('Ticket not found'))
        }

        if (await ticket.isReserved()) {
            return next(new ApiError('Ticket is already reserved', 400))
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.user!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        res.status(201).json({order});

    }
)


export {router as createOrderRouter}
