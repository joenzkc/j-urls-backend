import { Context } from "koa";
import { JurlService } from "../services/jurl.service";
import { validate } from "class-validator";
import Database from "../datasource";
import CreateJurlDto from "../dtos/createJurl.dto";
import { plainToClass } from "class-transformer";
import { getUserIdFromCtx } from "../utils/utils";
import { DeleteJurlDto } from "../dtos/deleteJurl.dto";

class JurlController {
  private jurlService: JurlService = new JurlService();

  public async createAnonymousUrl(ctx: Context) {
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

  public async createUrl(ctx: Context) {
    const dto = plainToClass(CreateJurlDto, ctx.request.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }
    const userId = getUserIdFromCtx(ctx);
    await Database.AppDataSource.manager.transaction(async (manager) => {
      const jurl = await this.jurlService.createJurl(userId, dto.url, manager);
      ctx.body = jurl;
    });
  }

  public async getActualUrl(ctx: Context) {
    const jurl = ctx.params.hashUrl;
    const actualUrl = await this.jurlService.getActualUrl(jurl);
    ctx.body = actualUrl;
  }

  public async createCustomUrl(ctx: Context) {
    const dto = plainToClass(CreateJurlDto, ctx.request.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const userId = getUserIdFromCtx(ctx);

    await Database.AppDataSource.manager.transaction(async (manager) => {
      const jurl = await this.jurlService.createCustomUrl(
        userId,
        dto.url,
        dto.customUrl,
        manager
      );
      ctx.body = jurl;
    });
  }

  public async deleteUrl(ctx: Context) {
    const dto = plainToClass(DeleteJurlDto, ctx.request.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }

    const userId = getUserIdFromCtx(ctx);

    await Database.AppDataSource.manager.transaction(async (manager) => {
      const jurl = await this.jurlService.deleteUrl(
        userId,
        dto.hashedUrl,
        manager
      );
      ctx.body = jurl;
    });
  }

  public async getAllHashedUrls(ctx: Context) {
    const urls = await this.jurlService.getAllHashedUrls();
    ctx.body = urls;
  }

  public async getUrlQr(ctx: Context) {
    const urlId = ctx.params.urlId;
    const qr = await this.jurlService.getUrlQr(urlId);

    ctx.type = "image/png";
    ctx.body = qr;
  }
}

export default new JurlController();
