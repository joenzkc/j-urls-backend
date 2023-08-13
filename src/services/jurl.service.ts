import { randomBytes } from "crypto";
import { Database } from "../datasource";
import { Jurl } from "../entities/jurl.entity";
import { EntityManager } from "typeorm";
import { User } from "../entities/user.entity";
import ApiError from "../errors/api.error";
import { errors } from "../errors/errors";
import qrcode from "qrcode";

export class JurlService {
  public async createAnonymousJurl(
    url: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);
    let hash = randomBytes(3).toString("hex");
    // regenerate hash if it is not unique
    while (await jurlRepo.findOne({ where: { hashUrl: hash } })) {
      hash = randomBytes(3).toString("hex");
    }

    let standardizedUrl = url;
    if (!url.startsWith("https://")) {
      standardizedUrl = "https://" + url;
    }

    const alreadyExists = await jurlRepo.findOne({
      where: {
        url: standardizedUrl,
        user: null,
      },
    });

    if (alreadyExists) {
      return alreadyExists;
    }

    const jurl = jurlRepo.create({
      url: standardizedUrl,
      hashUrl: hash,
    });

    return await jurlRepo.save(jurl);
  }

  public async createJurl(
    userId: string,
    url: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);
    const userRepo = manager.getRepository(User);
    let hash = randomBytes(3).toString("hex");
    // regenerate hash if it is not unique
    while (await jurlRepo.findOne({ where: { hashUrl: hash } })) {
      hash = randomBytes(3).toString("hex");
    }

    const user = await userRepo.findOneOrFail({ where: { id: userId } });

    let standardizedUrl = url;
    if (!url.startsWith("https://")) {
      standardizedUrl = "https://" + url;
    }

    const alreadyExists = await jurlRepo.findOne({
      where: {
        url: standardizedUrl,
        user: {
          id: user.id,
        },
      },
    });

    if (alreadyExists) {
      return alreadyExists;
    }

    const jurl = jurlRepo.create({
      url: standardizedUrl,
      hashUrl: hash,
      user,
    });

    return await jurlRepo.save(jurl);
  }

  public async createCustomUrl(
    userId: string,
    url: string,
    customUrl: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);
    const userRepo = manager.getRepository(User);
    let hash = customUrl;

    const user = await userRepo.findOneOrFail({ where: { id: userId } });

    let standardizedUrl = url;
    if (!url.startsWith("https://")) {
      standardizedUrl = "https://" + url;
    }

    const alreadyExists = await jurlRepo.findOne({
      where: {
        hashUrl: hash,
      },
    });

    if (alreadyExists) {
      throw new ApiError(
        "Custom URL already exists",
        400,
        errors.ALREADY_EXISTS
      );
    }

    const jurl = jurlRepo.create({
      url: standardizedUrl,
      hashUrl: hash,
      user,
    });

    return await jurlRepo.save(jurl);
  }

  public async getActualUrl(
    hashUrl: string,
    manager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);
    const jurl = await jurlRepo.findOneOrFail({
      where: {
        hashUrl,
      },
    });

    return jurl;
  }

  public async deleteUrl(
    userId: string,
    hashedUrl: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);

    const jurl = await jurlRepo.findOneOrFail({
      where: { hashUrl: hashedUrl },
      relations: ["user"],
    });

    if (userId !== jurl.user.id) {
      throw new ApiError("Unauthorized", 401, errors.UNAUTHORIZED);
    }

    jurl.isActive = false;
    await jurlRepo.save(jurl);
  }

  public async getAllHashedUrls(
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);
    const jurls = await jurlRepo.find({
      where: {
        isActive: true,
      },
    });

    return jurls;
  }

  public async getUrlQr(id: string, manager = Database.AppDataSource.manager) {
    const jurlRepo = manager.getRepository(Jurl);
    const jurl = await jurlRepo.findOneOrFail({
      where: {
        id,
      },
    });

    const pngBuffer = await qrcode.toBuffer(
      process.env.FRONTEND_URL + jurl.hashUrl,
      { width: 300 }
    );

    return pngBuffer;
  }
}
