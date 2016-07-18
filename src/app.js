import express             from "express";
import { router as index } from "./routes/index";
import { router as hooks } from "./routes/hook";
import config              from "config";

const serverConfig = config.get("Server");
const app = express();

app.use("/", index);
app.use("/hooks", hooks);

app.listen(serverConfig.port, () => {
  console.log('memebot is listening...');
});

export { app };