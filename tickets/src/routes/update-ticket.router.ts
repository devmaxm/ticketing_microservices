import {NextFunction, Request, Response, Router} from "express";
import {Ticket, TicketModel} from "../models/ticket";
import {body} from "express-validator";
import {ApiError, NotFoundError, requestValidateMiddleware, requireAuthMiddleware} from "@ticketing-services/common";

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
    if (ticket.userId !== req.user!.id) {
        return next(new ApiError('Unauthorized', 401))
    }
    ticket.set({
        title,
        price
    })
    await ticket.save()

    res.status(200).json(ticket)
})

export {router as updateTicketRouter}
