import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    res.status(401).json({ error: "Token error" });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ error: "Token malformatted" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
};
