import { Algorithm, JwtPayload, sign, verify } from "jsonwebtoken";

import { env } from "@/env";

type AsyncVerifyJwtProps = Parameters<typeof verify>["0"];

export const VerifyJwtAsync = (token: AsyncVerifyJwtProps) => {
  return new Promise<string | JwtPayload>(function (resolve, reject) {
    verify(token, env.TOKEN_SECRET, undefined, (error, decoded) => {
      if (error) return reject(new JwtError(error.message));
      if (!decoded) return reject(new JwtError("Failed to decode token"));
      return resolve(decoded);
    });
  });
};

type AsyncSignJwtProps = Parameters<typeof sign>["0"];

export const signJwtAsync = (token: AsyncSignJwtProps) => {
  return new Promise<string>(function (resolve, reject) {
    sign(
      token,
      env.TOKEN_SECRET,
      { algorithm: env.ALGORITHM as Algorithm },
      (error, encoded) => {
        if (error) return reject(new JwtError(error.message));
        if (!encoded) return reject(new JwtError("Failed to encode token"));
        return resolve(encoded);
      }
    );
  });
};

export class JwtError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JwtError";
    Error.captureStackTrace(this, this.constructor);
  }
}
