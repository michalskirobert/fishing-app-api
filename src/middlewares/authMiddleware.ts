import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import env from "@config/env";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Brak uprawnień" });
  }

  try {
    jwt.verify(token, env.JWT_SECRET);

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token użytkownika jest nie ważny" });
  }
};
