import { Context } from "koa";
import { LoginDto } from "../dtos/login.dto";
import { validate, validateOrReject } from "class-validator";
import AuthService from "../services/auth.service";
import { plainToClass } from "class-transformer";

class AuthController {
  private authService: AuthService = new AuthService();

  public async login(ctx: Context) {
    const dto = plainToClass(LoginDto, ctx.request.body);
    await validateOrReject(dto);
    const token = await this.authService.login(dto.username, dto.password);
    ctx.body = { token };
  }

  public async logout(ctx: Context) {}
}

export default new AuthController();
