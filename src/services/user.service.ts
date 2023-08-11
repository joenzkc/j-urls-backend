import { EntityManager, Repository } from "typeorm";
import Database from "../datasource";
import { User } from "../entities/user.entity";
import { hash } from "bcrypt";

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
}

export default UserService;
