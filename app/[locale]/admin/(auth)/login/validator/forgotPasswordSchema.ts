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
  });
};

// Type for the form data
export type ForgotPasswordFormData = z.infer<ReturnType<typeof createFormSchema>>;