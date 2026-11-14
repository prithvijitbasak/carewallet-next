/**
 * ============================================================================
 * USER UPDATE VALIDATOR (Zod Schema)
 * ============================================================================
 * 
 * What is this file for?
 * When a user updates their profile settings (name, username, email, phone),
 * all fields are optional (they might only want to change their email, for example).
 * 
 * This schema validates each field using the same strict rules as signup,
 * while allowing any field to be omitted (`.optional()`).
 */

import { z } from "zod";
import { fullName, username, email, phone } from "./auth.validator";

export const updateUserSchema = z.object({
  fullName: fullName.optional(),
  username: username.optional(),
  email: email.optional(),
  phone: phone.optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
