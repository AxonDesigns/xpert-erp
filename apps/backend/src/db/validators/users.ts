import "zod-openapi/extend";
import userTable from "@backend/db/schema/users";
import { getTableColumns } from "drizzle-orm";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
//import { openapiDecorator } from "@backend/lib/openapi-decorator";

const docs = {
	id: {
		description: "User's id",
		example: 1,
	},
	email: {
		description: "User's email",
		example: "john@doe.com",
	},
	password: {
		description: "User's password",
		example: "12345678",
	},
	username: {
		description: "User's username",
		example: "johndoe",
	},
	roleId: {
		description: "User's role id",
		examples: [1, 2, 3],
	},
	createdAt: {
		description: "Date user was created",
		example: "2023-07-01T00:00:00.000Z",
	},
	updatedAt: {
		description: "Date user was last updated",
		example: "2023-07-01T00:00:00.000Z",
	},
	otpSecret: {
		description: "User's otp secret",
		example: "12345678",
	},
};

export const insertUserSchema = createInsertSchema(userTable, {
	email: (schema) => schema.email(),
	password: (schema) =>
		schema
			.regex(
				/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){3,}$/,
				"Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.",
			)
			.min(8, "Password must be at least 8 characters long.")
			.max(255, "Password must be at most 255 characters long."),
	roleId: (schema) => schema,
}).omit({
	createdAt: true,
	updatedAt: true,
	otpSecret: true,
});

export const selectUserSchema = createSelectSchema(userTable, {
	id: (schema) => schema,
	email: (schema) => schema,
	username: (schema) => schema,
	roleId: (schema) => schema,
	createdAt: (schema) => schema,
	updatedAt: (schema) => schema,
});

export const selectPublicUserSchema = selectUserSchema.omit({
	password: true,
	otpSecret: true,
});

export const updateUserSchema = createUpdateSchema(userTable, {
	email: (schema) => schema.email(),
	username: (schema) => schema,
	roleId: (schema) => schema,
	password: (schema) => schema,
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
