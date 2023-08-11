import { errors } from "./errors";

export default class ApiError extends Error {
  public status: number;
  public errorCode: errors;

  constructor(message: string, statusCode: number, errorCode: errors) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.errorCode = errorCode;
  }
}
