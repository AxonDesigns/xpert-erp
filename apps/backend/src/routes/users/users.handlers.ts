import db from "@backend/db";
import userTable from "@backend/db/schema/users";
import { userPublicColumns } from "@backend/db/validators/users";
import type { AppRouteHandler } from "@backend/lib/types";
import type {
  CreateRoute,
  DeleteOneRoute,
  GetOneRoute,
  ListRoute,
  UpdateOneRoute,
} from "@backend/routes/users/users.routes";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userList = await db
    .select(userPublicColumns())
    .from(userTable)
    .limit(10)
    .offset(0);
  return c.json(userList, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db
    .select(userPublicColumns())
    .from(userTable)
    .where(eq(userTable.id, id));
  if (!user) {
    return c.json(
      {
        message: "User was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(user, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { email, password, username, roleId } = c.req.valid("json");

  const hashedPassword = await Bun.password.hash(password, "bcrypt");

  const [user] = await db
    .insert(userTable)
    .values({
      email,
      password: hashedPassword,
      username,
      roleId,
    })
    .returning(userPublicColumns());
  return c.json(user, HttpStatusCodes.CREATED);
};

export const updateOne: AppRouteHandler<UpdateOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { email, username, roleId } = c.req.valid("json");
  const [user] = await db
    .update(userTable)
    .set({
      email,
      username,
      roleId,
    })
    .where(eq(userTable.id, id))
    .returning(userPublicColumns());

  if (!user) {
    return c.json(
      {
        message: "User was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(user, HttpStatusCodes.OK);
};

export const deleteOne: AppRouteHandler<DeleteOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db
    .delete(userTable)
    .where(eq(userTable.id, id))
    .returning(userPublicColumns());
  if (!user) {
    return c.json(
      {
        message: "User was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(user, HttpStatusCodes.OK);
};
