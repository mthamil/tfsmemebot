import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const data = JSON.parse(req.body);
  res.json(data);
});

export { router };