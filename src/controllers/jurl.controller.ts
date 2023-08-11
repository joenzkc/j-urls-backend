import { Context } from "koa";
import { JurlService } from "../services/jurl.service";
import { validate } from "class-validator";
import Database from "../datasource";
import CreateJurlDto from "../dtos/createJurl.dto";
import { plainToClass } from "class-transformer";

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
}

export default new JurlController();
