import jwt from "jsonwebtoken";

export function getUserFromToken(token: string) {
  let user = null;
  try {
    user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
  }
  return user;
}
