import { Context } from "koa";
import { LoginDto } from "../dtos/login.dto";
import { validate } from "class-validator";

class AuthController {
  public async login(ctx: Context) {
    const dto = ctx.request.body as LoginDto;
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = { errors };
      return;
    }
  }
}

export default new AuthController();
