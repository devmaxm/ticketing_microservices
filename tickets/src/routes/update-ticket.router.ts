import {NextFunction, Request, Response, Router} from "express";
import {Ticket, TicketModel} from "../models/ticket";
import {body} from "express-validator";
import {ApiError, NotFoundError, requestValidateMiddleware, requireAuthMiddleware} from "@ticketing-services/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated.publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router()


router.put('/api/tickets/:id',[
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price should be greater than 0')
], requireAuthMiddleware, requestValidateMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const {title, price} = req.body
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        return next(new NotFoundError('Ticket not found'))
    }
    if (ticket.orderId) {
        next(new ApiError('Cannot edit reserved ticket', 400))
    }

    if (ticket.userId !== req.user!.id) {
        return next(new ApiError('Unauthorized', 401))
    }
    ticket.set({
        title,
        price
    })
    await ticket.save()

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: req.user!.id,
        version: ticket.version
    })

    res.status(200).json(ticket)
})

export {router as updateTicketRouter}
