import {
  selectRoleSchema,
  insertRoleSchema,
  updateRoleSchema,
} from "@backend/db/validators/roles";
import { createRoute, z } from "@hono/zod-openapi";
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
