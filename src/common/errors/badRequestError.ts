import CustomError from "./customError";

export default class BadRequestError extends CustomError{
    statusCode = 400;
    constructor(message:string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    serializeError() {
        return [{message: this.message}]
    }
}