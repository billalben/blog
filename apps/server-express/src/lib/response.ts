import type { Response, Request } from "express";

interface PaginationMeta {
  count: number;
  next: string | null;
  previous: string | null;
}

export function successResponse(
  res: Response,
  data: unknown,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function paginatedResponse(
  res: Response,
  data: unknown[],
  meta: PaginationMeta,
  message = "Success"
) {
  return res.status(200).json({ success: true, message, data, meta });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500
) {
  return res.status(statusCode).json({ success: false, message });
}

export function validationErrorResponse(
  res: Response,
  errors: { path: string; message: string }[]
) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
}

export function paginate(
  count: number,
  page: number,
  pageSize: number,
  req: Request
): PaginationMeta {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
  const totalPages = Math.ceil(count / pageSize);

  return {
    count,
    next:
      page < totalPages
        ? `${baseUrl}?page=${page + 1}&page_size=${pageSize}`
        : null,
    previous:
      page > 1
        ? `${baseUrl}?page=${page - 1}&page_size=${pageSize}`
        : null,
  };
}
