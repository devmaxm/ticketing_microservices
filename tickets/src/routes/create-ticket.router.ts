import {NextFunction, raw, Request, Response, Router} from "express";
import {body} from 'express-validator'
import {requestValidateMiddleware, requireAuthMiddleware} from "@ticketing-services/common";
import {Ticket} from "../models/ticket";
import {natsWrapper} from "../nats-wrapper";
import {TicketCreatedPublisher} from "../events/publishers/ticket-created.publisher";

const router = Router()

router.post('/api/tickets', [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price should be greater than 0')
], requireAuthMiddleware, requestValidateMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const {title, price} = req.body
    const userId = req.user!.id
    const ticket = Ticket.build({title, price, userId})
    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.status(201).json({ticket})
})

export {router as createTicketRouter}
