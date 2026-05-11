import { Router } from "express";

import authRoutes from "./auth";
import userRoutes from "./users";
import blogRoutes from "./blog";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API",
    data: {
      version: "1.0.0",
      docs: "/docs",
      timestamp: new Date().toISOString(),
    },
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/blogs", blogRoutes);

export default router;
