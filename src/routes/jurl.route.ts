import Router from "koa-router";
import jurlController from "../controllers/jurl.controller";
import jwt from "koa-jwt";
// import { config } from "process";
import { config } from "dotenv";
config();
const router = new Router();

router.post("/createAnon", async (ctx) => {
  await jurlController.createAnonymousUrl(ctx);
});

router.post(
  "/create",
  jwt({ secret: process.env.ACCESS_TOKEN_SECRET }),
  async (ctx) => {
    await jurlController.createUrl(ctx);
  }
);

router.post(
  "/createCustomUrl",
  jwt({ secret: process.env.ACCESS_TOKEN_SECRET }),
  async (ctx) => {
    await jurlController.createCustomUrl(ctx);
  }
);

router.post(
  "/delete",
  jwt({ secret: process.env.ACCESS_TOKEN_SECRET }),
  async (ctx) => {
    await jurlController.deleteUrl(ctx);
  }
);

router.get("/all", async (ctx) => {
  await jurlController.getAllHashedUrls(ctx);
});

router.post("/getUrlQr/:urlId", async (ctx) => {
  await jurlController.getUrlQr(ctx);
});

export default router.routes();
