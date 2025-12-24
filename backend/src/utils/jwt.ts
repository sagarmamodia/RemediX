import jwt from "jsonwebtoken";
import { config } from "../config/index.config.js";

const ACCESS_SECRET = config.jwt.secret;
const EXPIRES_IN = config.jwt.expiresIn;

export function generateAccessToken(id: string, role: string) {
  return jwt.sign(
    {
      id: id,
      role: role,
    },
    ACCESS_SECRET,
    { expiresIn: EXPIRES_IN } as jwt.SignOptions
  );
}
