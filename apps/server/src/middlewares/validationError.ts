import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validationErrorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(), // or errors: errors.mapped(),
    });
  }
  next();
};

export default validationErrorMiddleware;
