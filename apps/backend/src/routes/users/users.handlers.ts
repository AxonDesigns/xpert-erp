import db from "@backend/db";
import users from "@backend/db/schema/users";
import type { AppRouteHandler } from "@backend/lib/types";
import type { CreateRoute, DeleteOneRoute, GetOneRoute, ListRoute, UpdateOneRoute } from "@backend/routes/users/users.routes";
import { eq, getTableColumns, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

const publicColumns = () => {
  const { otpSecret, password, ...columns } = getTableColumns(users);
  return columns;
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userList = await db.select(publicColumns()).from(users).limit(10).offset(0);
  return c.json(userList, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db.select(publicColumns()).from(users).where(eq(users.id, id));
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
  const [user] = await db.insert(users).values({
    email,
    password,
    username,
    roleId
  }).returning(publicColumns());
  return c.json(user, HttpStatusCodes.CREATED);
};

export const updateOne: AppRouteHandler<UpdateOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { email, password, username, roleId } = c.req.valid("json");
  const [user] = await db.update(users).set({
    email,
    password,
    username,
    roleId
  }).where(eq(users.id, id)).returning(publicColumns());

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
  const [user] = await db.delete(users).where(eq(users.id, id)).returning(publicColumns());
  if (!user) {
    return c.json(
      {
        message: "User was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(
    user,
    HttpStatusCodes.OK,
  );
};