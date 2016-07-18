import express             from "express";
import { router as index } from "./routes/index";
import { router as hooks } from "./routes/hook";

const app = express();

app.use("/", index);
app.use("/hooks", hooks);

app.listen(3000, () => {
  console.log('memebot is listening...');
});

export { app };