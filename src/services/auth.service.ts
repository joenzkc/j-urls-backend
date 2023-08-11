import { EntityManager } from "typeorm";
import Database from "../datasource";
import { User } from "../entities/user.entity";
import { compare } from "bcrypt";

class AuthService {
  public async login(
    username: string,
    password: string,
    manager: EntityManager = Database.AppDataSource.manager
  ) {
    const userRepo = manager.getRepository(User);
    const user = await userRepo.findOneOrFail({ where: { username } });

    const valid = await compare(password, user.password);
    if (valid) {
      return true;
    } else {
      return false;
    }
  }
}

export default AuthService;
