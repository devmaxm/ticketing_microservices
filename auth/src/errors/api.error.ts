import {CustomError} from "./custom.error";

export default class ApiError extends CustomError {
    constructor(public message: string, public statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode

        Object.setPrototypeOf(this, ApiError.prototype)
    }

    serializeErrors() {
        return [{message: this.message}];
    }
}
