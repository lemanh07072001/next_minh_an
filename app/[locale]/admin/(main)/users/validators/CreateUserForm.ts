import { z } from "zod";
import { useTranslations } from "next-intl";

export const createUserFormSchema = () => {
  const tSchema = useTranslations("Schema");
    return z.object({
        name: z
            .string()
            .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
 ,
        email: z
            .string()
            .email({ message: "Email không hợp lệ" })
            ,
        phone: z
            .string()
            .nullable()
            .refine(
                (val) => !val || /^[0-9]{10,11}$/.test(val),
                { message: "Số điện thoại không hợp lệ" }
            ),
        status: z
            .string(),
        password: z
            .string()
            .min(8, {
              message: tSchema("PasswordMin8Length") || "Password must be at least 8 characters",
            })
            .max(100, {
              message: tSchema("PasswordMax100Length") || "Password cannot exceed 100 characters",
            }),
        welcomeEmail: z
            .boolean()
            .optional(),
        passwordChange: z
            .boolean()
            .optional()

        });
};

export type CreateUserFormData = z.infer<ReturnType<typeof createUserFormSchema>>;
