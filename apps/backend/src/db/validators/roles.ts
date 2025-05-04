import roleTable from "@backend/db/schema/roles";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

const idDetails = {
  description: "Role's id",
  examples: [1, 2, 3],
};

const nameDetails = {
  description: "Role's name",
  example: "user",
};

const descriptionDetails = {
  description: "Role's description",
  example: "Role for users with minimal access",
};

const createdAtDetails = {
  description: "Date role was created",
  example: "2023-07-01T00:00:00.000Z",
};

const updatedAtDetails = {
  description: "Date role was last updated",
  example: "2023-07-01T00:00:00.000Z",
};

export const selectRoleSchema = createSelectSchema(roleTable, {
});
export const insertRoleSchema = createInsertSchema(roleTable, {
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateRoleSchema = createUpdateSchema(roleTable, {
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
