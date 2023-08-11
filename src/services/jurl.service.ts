import { randomBytes } from "crypto";
import Database from "../datasource";
import { Jurl } from "../entities/jurl.entity";
import { EntityManager } from "typeorm";
import { User } from "../entities/user.entity";

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
        user,
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

  public async getActualUrl(
    hashUrl: string,
    manager = Database.AppDataSource.manager
  ) {
    const jurlRepo = manager.getRepository(Jurl);
    const jurl = await jurlRepo.findOne({
      where: {
        hashUrl,
      },
    });

    return jurl;
  }
}
