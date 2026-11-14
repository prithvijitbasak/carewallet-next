// Zod validation schemas for authentication credentials and registration

import { z } from "zod";

// Schema for user login with username, email, or phone identifier
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, { message: "The identifier must have at least 3 characters" })
    .max(50, { message: "The identifier can only be up to 50 characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password should have at least 8 characters" })
    .max(50, { message: "Password can only be up to 50 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
      {
        message:
          "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
      }
    ),
});

// Reusable field validators used across signup and profile update
export const fullName = z
  .string()
  .trim()
  .min(1, { message: "Please enter your full name" });

export const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, { message: "The username must have at least 3 characters" })
  .max(50, { message: "The username can only be up to 50 characters" })
  .regex(/^(?=.*[a-z])[a-z0-9]+$/, {
    message: "The username must be lowercase and contain only letters or numbers",
  });

export const email = z
  .string()
  .trim()
  .email({ message: "Invalid email address" });

export const phone = z
  .string()
  .trim()
  .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" });

export const password = z
  .string()
  .trim()
  .min(8, { message: "Password should have at least 8 characters" })
  .max(50, { message: "Password can only be up to 50 characters" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
    {
      message:
        "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    }
  );

export const role = z.string().trim().min(1, { message: "Please enter your role" });

export const timezone = z
  .string()
  .trim()
  .regex(/^[A-Za-z_]+\/[A-Za-z_]+$/, { message: "Invalid timezone format (e.g., Asia/Kolkata)" });

// Schema for new user registration
export const signupSchema = z.object({
  fullName,
  username,
  email,
  phone,
  password,
  role,
  timezone,
});

// Infer TypeScript types from Zod schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
