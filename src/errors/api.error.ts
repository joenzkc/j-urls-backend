export default class ApiError extends Error {
  public status: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
  }
}
