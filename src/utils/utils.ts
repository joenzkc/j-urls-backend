import jwt from "jsonwebtoken";
import { Context } from "vm";

export function getUserFromCtx(ctx: Context) {
  let user = null;
  // const token = ctx.req.authorization.split(" ")[1];
  const token = ctx.req.headers.authorization.split(" ")[1];
  // console.log(token);
  try {
    user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
  }
  return user;
}
