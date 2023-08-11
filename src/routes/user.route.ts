import Router from "koa-router";
import userController from "../controllers/user.controller";

const router = new Router();

router.post("/create", async (ctx) => {
  await userController.createUser(ctx);
});

export default router.routes();
