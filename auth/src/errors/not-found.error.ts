import {CustomError} from "./custom.error";

export default class NotFoundError extends CustomError {
    statusCode = 404

    constructor(public message: string = "Resource not found") {
        super();
        this.message = message

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeErrors(): { message: string }[] {
        return [{message: this.message}];
    }
}
