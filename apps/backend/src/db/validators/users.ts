import 'zod-openapi/extend';
import userTable from "@backend/db/schema/users";
import { getTableColumns } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

const idDetails = {
  description: "User's id",
  examples: [1, 2, 3],
};

const emailDetails = {
  description: "User's email",
  example: "john@doe.com",
};

const usernameDetails = {
  description: "User's username",
  example: "johndoe",
};

const roleIdDetails = {
  description: "User's role id",
  examples: [1, 2, 3],
};

const passwordDetails = {
  description: "User's password",
  example: "12345678",
};

const createdAtDetails = {
  description: "Date user was created",
  example: "2023-07-01T00:00:00.000Z",
};

const updatedAtDetails = {
  description: "Date user was last updated",
  example: "2023-07-01T00:00:00.000Z",
};

export const insertUserSchema = createInsertSchema(userTable, {
  email: (schema) => schema.email().openapi(emailDetails),
  password: (schema) =>
    schema
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){3,}$/,
        "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.",
      )
      .min(8, "Password must be at least 8 characters long.")
      .max(255, "Password must be at most 255 characters long.")
      .openapi(passwordDetails),
  roleId: (schema) => schema.openapi(roleIdDetails),
}).omit({
  createdAt: true,
  updatedAt: true,
  otpSecret: true,
});

export const selectUserSchema = createSelectSchema(userTable, {
  id: (schema) => schema.openapi(idDetails),
  email: (schema) => schema.email().openapi(emailDetails),
  username: (schema) => schema.openapi(usernameDetails),
  roleId: (schema) => schema.openapi(roleIdDetails).openapi(roleIdDetails),
  createdAt: (schema) => schema.openapi(createdAtDetails).openapi(createdAtDetails),
  updatedAt: (schema) => schema.openapi(updatedAtDetails).openapi(updatedAtDetails),
});

export const selectPublicUserSchema = selectUserSchema.omit({
  password: true,
  otpSecret: true,
});

export const updateUserSchema = createUpdateSchema(userTable, {
  email: (schema) => schema.email().openapi(emailDetails),
  username: (schema) => schema.openapi(usernameDetails),
  roleId: (schema) => schema.openapi(roleIdDetails),
  password: (schema) => schema.openapi(passwordDetails),
}).omit({
  createdAt: true,
  updatedAt: true,
  otpSecret: true,
  password: true,
});

export const userPublicColumns = () => {
  const { otpSecret, password, ...columns } = getTableColumns(userTable);
  return columns;
};
