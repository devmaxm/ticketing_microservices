import {ValidationError} from "express-validator";
import {CustomError} from "./custom.error";

export default class RequestValidationError extends CustomError{
    statusCode = 400

    constructor(public errors: ValidationError[]) {
        super();

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors(): { message: string }[] {
        return this.errors.map(error => {
            return {message: error.msg}
        });
    }
}
