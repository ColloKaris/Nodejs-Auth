export class ExpressError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ExpressError.prototype);
  }
}
