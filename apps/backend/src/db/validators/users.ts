import users from "@backend/db/schema/users";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email(),
  password: (schema) =>
    schema
      .regex(
        /^[!@#$%^&*(),.?":{}|<>]$/,
        "Password must contain at least one special character.",
      )
      .regex(/^\d+$/, "Password must contain at least one number.")
      .regex(/^[A-Z]$/, "Password must contain at least one uppercase letter.")
      .min(8, "Password must be at least 8 characters long.")
      .max(255, "Password must be at most 255 characters long."),
  roleId: (schema) => schema.openapi({ description: "User's role id" }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  otpSecret: true,
});

export const selectUserSchema = createSelectSchema(users, {
  id: (schema) => schema.openapi({ description: "User's id" }),
  email: (schema) => schema.email().openapi({ description: "User's email" }),
  username: (schema) => schema.openapi({ description: "User's username" }),
  roleId: (schema) => schema.openapi({ description: "User's role id" }),
  createdAt: (schema) => schema.openapi({ description: "Date user was created" }),
  updatedAt: (schema) => schema.openapi({ description: "Date user was last updated" }),
});

export const selectPublicUserSchema = selectUserSchema.omit({
  password: true,
  otpSecret: true,
});

export const updateUserSchema = createUpdateSchema(users, {
  email: (schema) => schema.email(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  otpSecret: true,
});