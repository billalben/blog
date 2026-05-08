import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import { validationErrorResponse } from "@/lib/response";

export function validate(schemas: {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
  cookies?: ZodType;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as any;
      if (schemas.params) req.params = schemas.params.parse(req.params) as any;
      if (schemas.cookies) schemas.cookies.parse(req.cookies);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(
          res,
          error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          }))
        );
      }
      next(error);
    }
  };
}
