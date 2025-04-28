import type { Context, Env } from "hono"
import { deleteCookie, setCookie } from "hono/cookie";
import { env } from "@env/backend";

export const setSessionCookie = <T extends Env>(c: Context<T>, token: string, expiresIn: Date) => {
  setCookie(c, "session", token, {
    path: "/",
    httpOnly: true,
    maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000, // milliseconds
    expires: expiresIn,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
}

export const deleteSessionCookie = <T extends Env>(c: Context<T>) => {
  deleteCookie(c, "session",);
}