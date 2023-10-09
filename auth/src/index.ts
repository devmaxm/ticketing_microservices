import express from 'express';
import mongoose from 'mongoose'
import {json} from 'body-parser'
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import cookieSession from 'cookie-session'

import {currentUserRouter} from "./routes/current-user.router";
import {signInRouter} from "./routes/sign-in.router";
import {signUpRouter} from "./routes/sign-up.router";
import {signOutRouter} from "./routes/sign-out.router";
import NotFoundError from "./errors/not-found.error";


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


async function bootstrap() {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    } catch (err) {
        console.error(err)
    }

    app.listen(3000, () => {
        console.log(`Server listening on port 3000!!`)
    })
}

bootstrap()
