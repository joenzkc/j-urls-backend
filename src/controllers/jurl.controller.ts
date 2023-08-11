import { Context } from "koa";
import { JurlService } from "../services/jurl.service";
import { validate } from "class-validator";
import Database from "../datasource";
import CreateJurlDto from "../dtos/createJurl.dto";
import { plainToClass } from "class-transformer";
import { getUserFromCtx } from "../utils/utils";

class JurlController {
  private jurlService: JurlService = new JurlService();

  public async createAnonymousJurl(ctx: Context) {
    const dto = plainToClass(CreateJurlDto, ctx.request.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    await Database.AppDataSource.manager.transaction(async (manager) => {
      const jurl = await this.jurlService.createAnonymousJurl(dto.url, manager);
      ctx.body = jurl;
    });
  }

  public async createJurl(ctx: Context) {
    const dto = plainToClass(CreateJurlDto, ctx.request.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }
    const userId = getUserFromCtx(ctx);
    await Database.AppDataSource.manager.transaction(async (manager) => {
      const jurl = await this.jurlService.createJurl(userId, dto.url, manager);
      ctx.body = jurl;
    });

    // console.log(token);
  }
}

export default new JurlController();
