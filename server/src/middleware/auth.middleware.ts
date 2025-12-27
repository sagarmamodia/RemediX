import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.config";
import { AppError } from "../utils/AppError"; // Assuming you have this from previous steps

// Define the shape of the decoded JWT payload
interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Check if token exists
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Attach user data to the request object
    // Now we can access req.user.id and req.user.role in the controllers
    res.locals.user = decoded as {
      id: string;
      role: string;
    };

    next();
  } catch (err) {
    return next(err);
  }
};
