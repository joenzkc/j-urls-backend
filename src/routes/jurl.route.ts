import Router from "koa-router";
import jurlController from "../controllers/jurl.controller";
import jwt from "koa-jwt";
// import { config } from "process";
import { config } from "dotenv";
config();
const router = new Router();

router.post("/createAnon", async (ctx) => {
  await jurlController.createAnonymousJurl(ctx);
});

router.post(
  "/create",
  jwt({ secret: process.env.ACCESS_TOKEN_SECRET }),
  async (ctx) => {
    await jurlController.createJurl(ctx);
  }
);

export default router.routes();
