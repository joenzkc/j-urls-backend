import Router from "koa-router";
import authController from "../controllers/auth.controller";

const router = new Router();

router.post("/login", async (ctx) => {
  await authController.login(ctx);
});

export default router.routes();
