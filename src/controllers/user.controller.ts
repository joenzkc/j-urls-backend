import { validate, validateOrReject } from "class-validator";
import { Context } from "koa";
import UserService from "../services/user.service";
import { LoginDto } from "../dtos/login.dto";
import { plainToClass } from "class-transformer";
import { getUserIdFromCtx } from "../utils/utils";

class UserController {
  userService: UserService = new UserService();

  public async createUser(ctx: Context) {
    const dto = plainToClass(LoginDto, ctx.request.body);
    await validateOrReject(dto);
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
