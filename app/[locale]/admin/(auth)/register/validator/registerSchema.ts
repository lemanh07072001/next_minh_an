import { z } from "zod";
import { useTranslations } from "next-intl";

// Function to create schema with translated messages
export const createRegisterFormSchema = () => {
  const tSchema = useTranslations("Schema");

  return z
      .object({
        name: z
            .string()
            .min(1, { message: tSchema("NameRequired") || "Name is required" })
            .max(100, { message: tSchema("NameMax100Length") || "Name cannot exceed 100 characters" }),

        email: z
            .string()
            .min(1, { message: tSchema("EmailRequired") || "Email is required" })
            .email({ message: tSchema("EmailInvalid") || "Please enter a valid email" }),

        password: z
            .string()
            .min(8, { message: tSchema("PasswordMin8Length") || "Password must be at least 8 characters" })
            .max(100, { message: tSchema("PasswordMax100Length") || "Password cannot exceed 100 characters" }),

        password_confirmation: z
            .string()
            .min(1, { message: tSchema("PasswordConfirmationRequired") || "Please confirm your password" }),
      })
      .refine(
          (data) => data.password === data.password_confirmation,
          {
            path: ["password_confirmation"],
            message: tSchema("PasswordNotMatch") || "Passwords do not match",
          }
      );
};

// Type for the form data
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterFormSchema>>;
