import { z } from "zod";
import { useTranslations } from "next-intl";

// Function to create schema with translated messages
export const createFormSchema = () => {
  const tSchema = useTranslations("Schema");

  return z.object({
    email: z
      .string()
      .min(1, { message: tSchema("EmailRequired") || "Email is required" })
      .email({ message: tSchema("EmailInvalid") || "Please enter a valid email" }),
    password: z
      .string()
      .min(8, {
        message: tSchema("PasswordMin8Length") || "Password must be at least 8 characters",
      })
      .max(100, {
        message: tSchema("PasswordMax100Length") || "Password cannot exceed 100 characters",
      }),
  });
};

// Type for the form data
export type LoginFormData = z.infer<ReturnType<typeof createFormSchema>>;