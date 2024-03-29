import jwt from "jsonwebtoken";
import { Context } from "vm";
import ApiError from "../errors/api.error";
import moment from "moment";
import { plainToClass } from "class-transformer";
import { errors } from "../errors/errors";
import { IsDateString, IsDefined, IsString } from "class-validator";
// import { JwtTokenDto } from "../dtos/jwtToken.dto";

export class JwtTokenDto {
  @IsDefined()
  @IsString()
  userId: string;

  @IsDefined()
  @IsDateString()
  expiresIn: string;
}

export function getUserIdFromCtx(ctx: Context) {
  let user = null;
  // const token = ctx.req.authorization.split(" ")[1];
  const token = ctx.req.headers.authorization.split(" ")[1];
  // console.log(token);
  user = plainToClass(
    JwtTokenDto,
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  );
  if (moment(user.expiresIn).isBefore(moment())) {
    throw new ApiError("Token expired", 401, errors.TOKEN_EXPIRED);
  }
  return user.userId;
}
