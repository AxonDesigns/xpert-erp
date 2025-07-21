import db from "@backend/db";
import userTable from "@backend/db/schema/users";
import { userPublicColumns } from "@backend/db/validators/users";
import type { AppRouteHandler } from "@backend/lib/types";
import type {
  LoginRoute,
  RegisterRoute,
  MeRoute,
  LogoutRoute,
} from "@backend/routes/auth/auth.routes";
import { env } from "@env/backend";
import { eq } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    return c.json(
      {
        message: "User was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const validPassword = await Bun.password.verify(password, user.password);

  if (!validPassword) {
    return c.json(
      {
        message: "Wrong credentials",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const { otpSecret, password: _, ...publicUser } = user;

  const token = await sign(
    {
      user: publicUser,
      exp: Math.floor(Date.now() / 1000) + env.ACCESS_TOKEN_EXPIRES_IN, // seconds
    },
    env.ACCESS_TOKEN_SECRET,
    "HS256",
  );

  setCookie(c, "access_token", token, {
    path: "/",
    httpOnly: true,
    maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000, // milliseconds
    expires: new Date(Date.now() + env.ACCESS_TOKEN_EXPIRES_IN * 1000), // milliseconds
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });

  return c.json(publicUser, HttpStatusCodes.OK);
};

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const { username, email, password, roleId } = c.req.valid("json");

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (user) {
    return c.json(
      {
        message: "User already exists",
      },
      HttpStatusCodes.CONFLICT,
    );
  }

  const hashedPassword = await Bun.password.hash(password);

  const [createdUser] = await db
    .insert(userTable)
    .values({
      username,
      email,
      password: hashedPassword,
      roleId,
    })
    .returning(userPublicColumns());

  if (!createdUser) {
    return c.json(
      {
        message: "User could not be created",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json(createdUser, HttpStatusCodes.CREATED);
};

export const me: AppRouteHandler<MeRoute> = async (c) => {
  const user = c.var.user;

  if (!user) {
    return c.json(
      {
        message: "Unauthorized",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  return c.json(user, HttpStatusCodes.OK);
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  deleteCookie(c, "access_token", {
    path: "/",
  });

  return c.json(
    {
      message: "Logout successful",
    },
    HttpStatusCodes.OK,
  );
};
