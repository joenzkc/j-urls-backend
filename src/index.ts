import "reflect-metadata";
import { config } from "dotenv";
import Koa from "koa";
import Database from "./datasource";
import router from "./routes";
import bodyParser from "koa-bodyparser";
import { errorHandler } from "./middleware/errorHandler.middleware";
import cors from "@koa/cors";

config();

const app = new Koa();

class Server {
  public async setupServer() {
    await Database.setupDb();
    app.use(
      bodyParser({
        enableTypes: ["json"],
        onerror: (err, ctx) => {
          ctx.throw("body parse error", 422);
        },
      })
    );
    app.use(errorHandler);
    // app.use(
    //   jwt({ secret: process.env.JWT_SECRET }).unless({
    //     path: [/^\/auth\/login/],
    //   })
    // );
    app.use(cors());
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(process.env.PORT || 5000);
    console.log(`Server started on port ${process.env.PORT || 5000}`);
  }
}

try {
  new Server().setupServer();
} catch (error) {
  console.log(error);
}
