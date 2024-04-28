import { Algorithm, JwtPayload, sign, verify } from "jsonwebtoken";

import { env } from "@/env";

type AsyncVerifyJwtProps = Parameters<typeof verify>["0"];

export const VerifyJwtAsync = (token: AsyncVerifyJwtProps) => {
  return new Promise<string | JwtPayload>(function (resolve, reject) {
    verify(token, env.TOKEN_SECRET, undefined, (error, decoded) => {
      if (error) return reject(error);
      if (!decoded) return reject(new Error("failed to decode token"));
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
        if (error) return reject(error);
        if (!encoded) return reject(new Error("failed to encode token"));
        return resolve(encoded);
      }
    );
  });
};
