import db from "@backend/db";
import users from "@backend/db/schema/users";
import { userPublicColumns } from "@backend/db/validators/users";
import type { AppRouteHandler } from "@backend/lib/types";
import type {
  LoginRoute,
  RegisterRoute,
  LogoutRoute,
} from "@backend/routes/auth/auth.routes";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const [user] = await db.select().from(users).where(eq(users.email, email));

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

  return c.json(publicUser, HttpStatusCodes.OK);
};
