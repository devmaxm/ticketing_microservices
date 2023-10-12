import express from 'express';
import {json} from 'body-parser'
import {currentUserMiddleware, errorHandlerMiddleware, NotFoundError} from "@ticketing-services/common";
import cookieSession from 'cookie-session'


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

app.all('*', async (req, res, next) => {
    next(new NotFoundError())
})

// error handling
app.use(errorHandlerMiddleware)

export default app
