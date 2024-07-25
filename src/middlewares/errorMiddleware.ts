import { commonMessages } from "@utils/constants";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || commonMessages.commonServerError;
  res.status(status).json({ message });
};
