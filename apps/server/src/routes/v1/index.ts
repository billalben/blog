import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
    status: "success",
    version: "1.0.0",
    docs: "/docs",
    timestamp: new Date().toISOString(),
  });
});

export default router;
