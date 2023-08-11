import Router from "koa-router";
import jurlController from "../controllers/jurl.controller";

const router = new Router();

router.post("/createAnon", async (ctx) => {
  await jurlController.createAnonymousJurl(ctx);
});

export default router.routes();
