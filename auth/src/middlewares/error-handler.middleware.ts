import {NextFunction, Request, Response} from "express";
import {CustomError} from "../errors/custom.error";

function errorHandlerMiddleware(
    err: CustomError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({errors: err.serializeErrors()})
    }

    return res.status(500).json({errors: "Server error"})
}

export default errorHandlerMiddleware
