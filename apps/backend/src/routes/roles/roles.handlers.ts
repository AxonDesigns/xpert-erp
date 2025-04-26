import db from "@backend/db";
import roles from "@backend/db/schema/roles";
import type { AppRouteHandler } from "@backend/lib/types";
import type {
  CreateRoute,
  DeleteOneRoute,
  GetOneRoute,
  ListRoute,
  UpdateOneRoute,
} from "@backend/routes/roles/roles.routes";
import { eq, getTableColumns, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

const publicColumns = () => {
  const { ...columns } = getTableColumns(roles);
  return columns;
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userList = await db
    .select(publicColumns())
    .from(roles)
    .limit(10)
    .offset(0);
  return c.json(userList, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db
    .select(publicColumns())
    .from(roles)
    .where(eq(roles.id, id));
  if (!user) {
    return c.json(
      {
        message: "Role was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(user, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { name, description } = c.req.valid("json");

  const [role] = await db
    .insert(roles)
    .values({
      name,
      description,
    })
    .returning(publicColumns());
  return c.json(role, HttpStatusCodes.CREATED);
};

export const updateOne: AppRouteHandler<UpdateOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { name, description } = c.req.valid("json");
  const [role] = await db
    .update(roles)
    .set({
      name,
      description,
    })
    .where(eq(roles.id, id))
    .returning(publicColumns());

  if (!role) {
    return c.json(
      {
        message: "Role was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(role, HttpStatusCodes.OK);
};

export const deleteOne: AppRouteHandler<DeleteOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [role] = await db
    .delete(roles)
    .where(eq(roles.id, id))
    .returning(publicColumns());
  if (!role) {
    return c.json(
      {
        message: "Role was not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(role, HttpStatusCodes.OK);
};
