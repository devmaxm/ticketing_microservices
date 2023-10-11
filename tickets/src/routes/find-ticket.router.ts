import {Router} from "express";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@ticketing-services/common";

const router = Router()

router.get('/api/tickets/:id', async (req, res, next) => {
    const {id} = req.params
    const ticket = await Ticket.findById(id)
    if (!ticket) {
        return next(new NotFoundError('Ticket not found'))
    }
    res.status(200).json({ticket})
})

export {router as findTicketRouter}
