import express from 'express';
import {json} from 'body-parser'
import {currentUserMiddleware, errorHandlerMiddleware, NotFoundError} from "@ticketing-services/common";
import cookieSession from 'cookie-session'
import {createTicketRouter} from "./routes/create-ticket.router";
import {allTicketRouter} from "./routes/all-tickets.router";
import {findTicketRouter} from "./routes/find-ticket.router";
import {updateTicketRouter} from "./routes/update-ticket.router";


const app = express()

// middlewares
app.use(json())
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false,
    keys: ['123']
}))
app.use(currentUserMiddleware)

// routes
app.use(createTicketRouter)
app.use(allTicketRouter)
app.use(findTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res, next) => {
    next(new NotFoundError())
})

// error handling
app.use(errorHandlerMiddleware)

export default app
