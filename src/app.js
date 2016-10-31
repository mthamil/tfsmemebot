import "babel-polyfill";
import Koa from "koa";
import convert from "koa-convert";
import errorHandler from "koa-better-error-handler";
import bodyParser from "koa-better-body";
import mount from "koa-mount";
import { router as index } from "./routes/index";
import { router as hooks } from "./routes/hook";
import config from "config";

const serverConfig = config.get("Server");
const app = new Koa();

app.context.onerror = errorHandler;
app.context.api = true;
app.use(convert(bodyParser()));

const base = "/memebot";
app.use(mount(base, index.middleware()));
app.use(mount(base, hooks.middleware()));

app.listen(serverConfig.port, () => {
  console.log("memebot is listening...");
});

export { app };