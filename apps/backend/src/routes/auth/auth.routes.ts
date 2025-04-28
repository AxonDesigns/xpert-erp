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

const tags = ["auth"];

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
    [HttpStatusCodes.CONFLICT]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.CONFLICT),
      "User already exists",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.INTERNAL_SERVER_ERROR),
      "User could not be created",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectPublicUserSchema),
      "Invalid user",
    ),
  },
});

export const me = createRoute({
  path: "/auth/me",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPublicUserSchema,
      "Authenticated user",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED),
      "Unauthorized",
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
    )
  },
});

export type LoginRoute = typeof login;
export type RegisterRoute = typeof register;
export type MeRoute = typeof me;
export type LogoutRoute = typeof logout;
