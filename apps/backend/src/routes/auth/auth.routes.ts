import { loginSchema } from "@backend/db/validators/login";
import {
  insertUserSchema,
  selectPublicUserSchema,
  updateUserSchema,
} from "@backend/db/validators/users";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdParamsSchema,
} from "stoker/openapi/schemas";

const tags = ["users"];

export const login = createRoute({
  path: "/auth/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(loginSchema, "Credentials to login"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPublicUserSchema,
      "Authenticated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "User was not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED),
      "Wrong credentials",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      "Invalid credentials",
    ),
  },
});

export const register = createRoute({
  path: "/auth/register",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(insertUserSchema, "User to register"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPublicUserSchema,
      "Registered user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectPublicUserSchema),
      "Invalid user",
    ),
  },
});

export const logout = createRoute({
  path: "/auth/logout",
  method: "post",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.OK),
      "Logout successful",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "User was not found",
    ),
  },
});

export type LoginRoute = typeof login;
export type RegisterRoute = typeof register;
export type LogoutRoute = typeof logout;
