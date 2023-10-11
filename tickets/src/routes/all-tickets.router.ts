import {Router} from "express";
import {Ticket} from "../models/ticket";

const router = Router()

router.get('/api/tickets', async (req, res, next) => {
    const tickets = await Ticket.find({})
    return res.status(200).json({tickets})
})


export {router as allTicketRouter}
