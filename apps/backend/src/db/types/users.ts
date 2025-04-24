import type { insertUserSchema, selectUserSchema, updateUserSchema } from "@backend/db/validators/users";
import type { z } from "zod";

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type PublicUser = Omit<User, "password" | "otpSecret">;