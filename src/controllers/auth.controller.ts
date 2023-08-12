import { Context } from "koa";
import { LoginDto } from "../dtos/login.dto";
import { validate, validateOrReject } from "class-validator";
import AuthService from "../services/auth.service";
import { plainToClass } from "class-transformer";
import ApiError from "../errors/api.error";
import { errors } from "../errors/errors";
import { getUserIdFromCtx } from "../utils/utils";
import UserService from "../services/user.service";
import { SendUserDto } from "../dtos/sendUserDto";

class AuthController {
  private authService: AuthService = new AuthService();
  private userService: UserService = new UserService();

  public async login(ctx: Context) {
    const dto = plainToClass(LoginDto, ctx.request.body);
    await validateOrReject(dto);
    const token = await this.authService.login(dto.username, dto.password);
    ctx.body = { token };
  }

  public async verifyToken(ctx: Context) {
    const token = ctx.request.headers["authorization"];
    if (!token) {
      throw new ApiError("No token provided", 401, errors.UNAUTHORIZED);
    }

    const userId = getUserIdFromCtx(ctx);

    const user = await this.userService.getUserById(userId);
    delete user.password;
    ctx.body = user;
  }

  public async logout(ctx: Context) {}
}

export default new AuthController();
