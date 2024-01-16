import CustomError from "./customError";

export default class ForBiddenError extends CustomError {
  statusCode = 403;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ForBiddenError.prototype);
  }
  serializeError() {
    return [{ message: this.message }];
  }
}
