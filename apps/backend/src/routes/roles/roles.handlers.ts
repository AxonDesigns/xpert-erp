import db from "@backend/db";
import roleTable from "@backend/db/schema/roles";
import type { AppRouteHandler } from "@backend/lib/types";
import type {
  CreateRoute,
  DeleteOneRoute,
  GetOneRoute,
  ListRoute,
  UpdateOneRoute,
} from "@backend/routes/roles/roles.routes";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  like,
  or,
  sql,
} from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

const publicColumns = () => {
  const { ...columns } = getTableColumns(roleTable);
  return columns;
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page, limit, sort, filter } = c.req.valid("query");
  const order = sort
    .map(({ field, order }) => {
      const columns = Object.values(getTableColumns(roleTable));
      const column = columns.find((col) => col.name === field);
      if (!column) return null;

      return (
        {
          asc: asc(column),
          desc: desc(column),
        }[order] || null
      );
    })
    .filter((order) => order !== null);

  const filterConditions = filter
    .map(({ field, filter }) => {
      const columns = Object.values(getTableColumns(roleTable));
      const column = columns.find((col) => col.name === field);
      if (!column) return null;

      if (field === "id") {
        const id = Number.parseInt(filter);
        if (Number.isNaN(id)) return null;
        return eq(column, id);
      }

      return ilike(column, `%${filter}%`);
    })
    .filter((filter) => filter !== null);

  const userList = await db
    .select(publicColumns())
    .from(roleTable)
    .limit(limit)
    .offset(page * limit)
    .orderBy(...order)
    .where(or(...filterConditions));

  return c.json(userList, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db
    .select(publicColumns())
    .from(roleTable)
    .where(eq(roleTable.id, id));
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
    .insert(roleTable)
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
    .update(roleTable)
    .set({
      name,
      description,
    })
    .where(eq(roleTable.id, id))
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
    .delete(roleTable)
    .where(eq(roleTable.id, id))
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
