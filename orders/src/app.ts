import express from 'express';
import {json} from 'body-parser'
import {currentUserMiddleware, errorHandlerMiddleware, NotFoundError} from "@ticketing-services/common";
import cookieSession from 'cookie-session'
import {createOrderRouter} from "./routes/create-order.router";
import {findOrderRouter} from "./routes/find-order.router";
import {allOrdersRouter} from "./routes/all-orders.router";
import {deleteOrderRouter} from "./routes/delete-order.router";


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
app.use(createOrderRouter)
app.use(findOrderRouter)
app.use(allOrdersRouter)
app.use(deleteOrderRouter)

app.all('*', async (req, res, next) => {
    next(new NotFoundError())
})

// error handling
app.use(errorHandlerMiddleware)

export default app
