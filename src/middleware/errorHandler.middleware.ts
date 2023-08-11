import { Context, Next } from "koa";
import { errors } from "../errors/errors";

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
    } else {
      ctx.body = {
        error: {
          message: error.message || "An error occurred",
        },
      };
    }
  }
}
