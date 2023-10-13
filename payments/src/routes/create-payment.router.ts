import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuthMiddleware,
    requestValidateMiddleware,
    ApiError,
    NotFoundError,
    OrderStatus,
} from '@ticketing-services/common';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created.publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments',

    [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
    requireAuthMiddleware, requestValidateMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            next(new NotFoundError('Order not found'))
        }

        if (order!.userId !== req.user!.id) {
            next(new ApiError('Unauthorized', 401))
        }

        if (order!.status === OrderStatus.Cancelled) {
            (new ApiError('Cannot pay for an cancelled order', 400))
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order!.price * 100,
            source: token,
        });
        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
        });
        await payment.save();
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };
