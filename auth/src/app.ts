import express from 'express';
import {json} from 'body-parser'
import {errorHandlerMiddleware, NotFoundError} from "@ticketing-services/common";
import cookieSession from 'cookie-session'

import {currentUserRouter} from "./routes/current-user.router";
import {signInRouter} from "./routes/sign-in.router";
import {signUpRouter} from "./routes/sign-up.router";
import {signOutRouter} from "./routes/sign-out.router";


const app = express()

// middlewares
app.use(json())
app.use(cookieSession({
    keys: ['123']
}))

// routes
app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all('*', async (req, res, next) => {
    next(new NotFoundError())
})

// error handling
app.use(errorHandlerMiddleware)

export default app
