import { validate } from "class-validator";
import { Context } from "koa";
import UserService from "../services/user.service";
import { LoginDto } from "../dtos/login.dto";

class UserController {
  userService: UserService = new UserService();

  public async createUser(ctx: Context) {
    const dto = ctx.request.body as LoginDto;
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.body = errors;
      ctx.status = 400;
      return;
    }
    const user = await this.userService.createUser(dto.username, dto.password);
    ctx.body = user;
  }
}

export default new UserController();
