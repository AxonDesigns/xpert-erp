import "zod-openapi/extend";
import roleTable from "@backend/db/schema/roles";
import {
  selectRoleSchema,
  insertRoleSchema,
  updateRoleSchema,
} from "@backend/db/validators/roles";
import { createRoute, z } from "@hono/zod-openapi";
import { getTableColumns } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

const tags = ["roles"];

export const list = createRoute({
  path: "/roles",
  method: "get",
  tags,
  request: {
    query: z.object({
      page: z.coerce.number().default(0).openapi({
        description: "Page number",
        example: 1,
      }),
      limit: z.coerce.number().default(20).openapi({
        description: "Number of items per page",
        example: 10,
      }),
      sort: z
        .string()
        .default("")
        .transform((value) => {
          if (!value) return [];
          const directions = ["asc", "desc"];
          const tableColumns = Object.values(getTableColumns(roleTable)).map(
            (col) => col.name,
          );
          return value
            .split(",")
            .map((pair) => {
              const [field, direction] = pair.split(":");
              if (!field || !direction) return null;

              const validDirection = directions.includes(direction);
              const validField = tableColumns.includes(field);
              if (!validDirection || !validField) return null;

              return {
                field,
                order: direction,
              };
            })
            .filter((pair) => pair !== null);
        })
        .openapi({
          description: "Sorting options",
          example: "id:asc,name:desc",
        }),
      filter: z
        .string()
        .default("")
        .transform((value) => {
          if (!value) return [];

          return value
            .split(",")
            .map((value) => {
              const [field, filter] = value.split(":");
              if (!field || !filter) return null;
              const tableColumns = Object.values(
                getTableColumns(roleTable),
              ).map((col) => col.name);
              if (!tableColumns.includes(field)) return null;
              return {
                field,
                filter,
              };
            })
            .filter((pair) => pair !== null);
        })
        .openapi({
          description: "Filtering options",
          example: "id:1,name:user",
        }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectRoleSchema),
      "List of roles",
    ),
  },
});

export const getOne = createRoute({
  path: "/roles/{id}",
  method: "get",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRoleSchema, "Role"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "Role was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id",
    ),
  },
});

export const create = createRoute({
  path: "/roles",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertRoleSchema, "Role to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectRoleSchema, "Created role"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectRoleSchema),
      "Invalid role",
    ),
  },
});

export const updateOne = createRoute({
  path: "/roles/{id}",
  method: "put",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateRoleSchema, "Role to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRoleSchema, "Updated role"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "Role was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(createErrorSchema(updateRoleSchema)),
      "Validation error",
    ),
  },
});

export const deleteOne = createRoute({
  path: "/roles/{id}",
  method: "delete",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRoleSchema, "Deleted role"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "Role was not found",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateOneRoute = typeof updateOne;
export type DeleteOneRoute = typeof deleteOne;
