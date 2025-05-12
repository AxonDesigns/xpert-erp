import 'zod-openapi/extend';
import phoneNumberTable from "@backend/db/schema/phone-numbers";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { isValidPhoneNumber, format } from 'libphonenumber-js';
import type { ZodString } from 'zod';

export const selectPhoneNumberSchema = createSelectSchema(phoneNumberTable);

function phoneValidation(schema: ZodString) {
  return schema.refine(isValidPhoneNumber, { message: "Invalid phone number" })
    .transform(phoneNumber => format(phoneNumber, 'E.164'));
}

export const insertPhoneNumberSchema = createInsertSchema(phoneNumberTable, {
  phoneNumber: phoneValidation,
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updatePhoneNumberSchema = createUpdateSchema(phoneNumberTable, {
  phoneNumber: phoneValidation,
}).omit({
  createdAt: true,
  updatedAt: true,
});