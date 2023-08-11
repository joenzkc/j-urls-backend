import { Context, Next } from "koa";
import { errors } from "../errors/errors";
import { ValidationError } from "class-validator";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next(); // Execute the downstream middleware first
  } catch (error) {
    // Handle the error here
    console.error("Error:", error);

    // Set the status code based on the error type
    ctx.status = error.status || 500;

    // Set the response body with the error message
    if ((error.name as string) === errors.QUERY_FAILED) {
      ctx.body = {
        errorType: "QueryFailedError",
        error: {
          message: error.message || "An error occurred",
        },
      };
    }
    // if (error.name === )
    // console.error(error.message);
    if (error.errorCode === errors.INVALID_USERNAME_OR_PASSWORD) {
      ctx.body = {
        errorType: "InvalidUsernameOrPassword",
        error: {
          message: error.message || "Invalid Credentials",
        },
      };
    }

    if (error.length > 0 && error[0] instanceof ValidationError) {
      ctx.body = {
        errorType: "ValidationError",
        error: error.map((err: ValidationError) => {
          return {
            property: err.property,
            constraints: err.constraints,
          };
        }),
      };
    } else {
      ctx.body = {
        error: {
          message: error.message || "An error occurred",
        },
      };
    }
  }
}
