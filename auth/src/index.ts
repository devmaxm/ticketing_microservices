import mongoose from 'mongoose'
import app from "./app";

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
