import { EntityManager } from "typeorm";
import { Database } from "../datasource";
import { User } from "../entities/user.entity";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../errors/api.error";
import http from "http-status-codes";
import moment from "moment";
import { errors } from "../errors/errors";
import { getUserIdFromCtx } from "../utils/utils";
// import jwt from "koa-jwt";

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
      const payload = {
        userId: user.id,
        expiresIn: moment().add(30, "minute").toDate(),
      };

      const token = jwt.sign(
        JSON.stringify(payload),
        process.env.ACCESS_TOKEN_SECRET
      );
      return token;
    } else {
      throw new ApiError(
        "Invalid username or password",
        http.UNAUTHORIZED,
        errors.INVALID_USERNAME_OR_PASSWORD
      );
    }
  }
}

export default AuthService;
