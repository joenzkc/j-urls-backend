import Router from "koa-router";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import jurlRoute from "./jurl.route";
import jurlController from "../controllers/jurl.controller";

const router = new Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/jurl", jurlRoute);
router.get("/", async (ctx) => {
  ctx.body = "Woke!";
});

router.get("/:hashUrl", async (ctx) => {
  // TODO: return the real url
  await jurlController.getActualUrl(ctx);
});

export default router;
