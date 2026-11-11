import { z } from "zod";
import { fullName, username, email, phone } from "./auth.validator";

export const updateUserSchema = z.object({
  fullName: fullName.optional(),
  username: username.optional(),
  email: email.optional(),
  phone: phone.optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
