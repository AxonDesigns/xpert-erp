import { insertUserSchema, selectPublicUserSchema, updateUserSchema } from "@backend/db/validators/users";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdParamsSchema } from "stoker/openapi/schemas";

const tags = ['users'];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectPublicUserSchema),
      "List of users",
    ),
  },
});

export const getOne = createRoute({
  path: "/users/{id}",
  method: "get",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPublicUserSchema,
      "User",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "User was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id",
    ),
  },
});

export const create = createRoute({
  path: "/users",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      insertUserSchema,
      "User to create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPublicUserSchema,
      "Create user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectPublicUserSchema),
      "Invalid user",
    ),
  },
});

export const updateOne = createRoute({
  path: "/users/{id}",
  method: "put",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      updateUserSchema,
      "User to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPublicUserSchema,
      "Updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "User was not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema).or(createErrorSchema(updateUserSchema)),
      "Validation error",
    ),
  },
});

export const deleteOne = createRoute({
  path: "/users/{id}",
  method: "delete",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPublicUserSchema,
      "Deleted user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "User was not found",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateOneRoute = typeof updateOne;
export type DeleteOneRoute = typeof deleteOne;