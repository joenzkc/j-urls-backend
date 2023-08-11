import { Context } from "koa";
import { LoginDto } from "../dtos/login.dto";
import { validate } from "class-validator";
import AuthService from "../services/auth.service";

class AuthController {
  private authService: AuthService = new AuthService();

  public async login(ctx: Context) {
    const dto = ctx.request.body as LoginDto;
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = { errors };
      return;
    }

    const token = await this.authService.login(dto.username, dto.password);
    ctx.body = { token };
  }
}

export default new AuthController();
