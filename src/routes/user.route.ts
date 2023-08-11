import Router from "koa-router";
import userController from "../controllers/user.controller";
import { config } from "dotenv";
import jwt from "koa-jwt";

const router = new Router();
config();

router.post("/create", async (ctx) => {
  console.log(ctx);
  await userController.createUser(ctx);
});

router.post(
  "/urls",
  jwt({ secret: process.env.ACCESS_TOKEN_SECRET }),
  async (ctx) => {
    await userController.getUsersUrls(ctx);
  }
);

export default router.routes();
