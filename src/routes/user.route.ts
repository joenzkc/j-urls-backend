import Router from "koa-router";
import userController from "../controllers/user.controller";
import { config } from "dotenv";

const router = new Router();
config();

router.post("/create", async (ctx) => {
  console.log(ctx);
  await userController.createUser(ctx);
});

export default router.routes();
