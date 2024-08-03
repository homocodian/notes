import { Generator } from "elysia-rate-limit";
import { User } from "lucia";

export const rateLimiterkeyGenerator: Generator<{
  ip: string;
  user?: User;
}> = async (req, _server, { ip, user }) => {
  if (
    (req.url.includes("/email-verification") || req.url.includes("/users")) &&
    user
  ) {
    return Bun.hash(JSON.stringify(user.id + ip)).toString();
  }
  return Bun.hash(JSON.stringify(ip)).toString();
};
