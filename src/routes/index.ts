import Router from "koa-router";
import authRoute from "./auth.route";
import userRoute from "./user.route";

const router = new Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);

router.get("/", async (ctx) => {
  ctx.body = "Woke!";
});

export default router;
