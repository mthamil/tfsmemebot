import express             from "express";
import bodyParser          from "body-parser";
import { router as index } from "./routes/index";
import { router as hooks } from "./routes/hook";
import config              from "config";

const serverConfig = config.get("Server");
const app = express();

app.use(bodyParser.json());

const base = "/memebot";
app.use(base, index);
app.use(base, hooks);

app.listen(serverConfig.port, () => {
  console.log('memebot is listening...');
});

export { app };