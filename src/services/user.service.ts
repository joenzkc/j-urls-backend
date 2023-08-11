import { EntityManager, Repository } from "typeorm";
import Database from "../datasource";
import { User } from "../entities/user.entity";
import { hash } from "bcrypt";
import { Jurl } from "../entities/jurl.entity";

class UserService {
  public async createUser(
    username: string,
    password: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const userRepo = manager.getRepository(User);
    const hashedPassword = await hash(password, 10);
    const user = userRepo.create({ username, password: hashedPassword });
    return userRepo.save(user);
    // const repo = manager
  }

  public async getUsersUrls(
    userId: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    // const jurlRepo = manager.getRepository(Jurl);
    const userRepo = manager.getRepository(User);
    const user = await userRepo.findOneOrFail({
      where: { id: userId },
      relations: ["urls"],
    });
    return user.urls.filter((jurl) => jurl.isActive);
  }
}

export default UserService;
