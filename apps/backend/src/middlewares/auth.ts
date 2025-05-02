import type { PublicUser } from "@backend/db/types/users";
import type { AppBindings } from "@backend/lib/types";
import { env } from "@env/backend";
import type { Context, Env } from "hono";
import { getCookie, getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";

const getTokenFromHeader = <T extends Env>(c: Context<T>) => {
  const header = c.req.header("Authorization");
  if (!header) return undefined;
  const split = header.split(" ");
  if (split.length !== 2) return split[0];
  return split[1];
};

const getTokenFromCookie = async <T extends Env>(c: Context<T>) => {
  const token = await getSignedCookie(
    c,
    env.ACCESS_TOKEN_COOKIE_SECRET,
    "access_token",
  );
  return token;
};

const publicRoutes = [
  "/api/auth/login",
];

const auth = createMiddleware<AppBindings>(async (c, next) => {
  if (
    publicRoutes.some((route) => {
      return c.req.path.match(route);
    })
  ) {
    return next();
  }

  const token = getTokenFromHeader(c) || (await getTokenFromCookie(c));

  if (token) {
    //const processed = token.split(".").slice(0, 2).join(".");
    try {
      const { user } = await verify(token, env.ACCESS_TOKEN_SECRET, "HS256");
      c.set("user", user as PublicUser);
      return next();
    } catch (error) { }
  }

  return c.json(
    {
      message: "Unauthorized",
    },
    HttpStatusCodes.UNAUTHORIZED,
  );
});

export default auth;
