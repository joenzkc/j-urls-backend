import { validate } from "class-validator";
import { Context } from "koa";
import UserService from "../services/user.service";
import { LoginDto } from "../dtos/login.dto";
import { plainToClass } from "class-transformer";
import { getUserIdFromCtx } from "../utils/utils";

class UserController {
  userService: UserService = new UserService();

  public async createUser(ctx: Context) {
    const dto = plainToClass(LoginDto, ctx.request.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const user = await this.userService.createUser(dto.username, dto.password);
    ctx.body = user;
  }

  public async getUsersUrls(ctx: Context) {
    const user = await getUserIdFromCtx(ctx);
    ctx.body = await this.userService.getUsersUrls(user);

    // ctx.body = this.userService.getUsersUrls(user);
  }
}

export default new UserController();
