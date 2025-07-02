import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { X, Mail, ArrowLeft } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createFormSchema,
  ForgotPasswordFormData,
} from "@/app/[locale]/admin/(auth)/login/validator/forgotPasswordSchema";
import { fa } from "zod/v4/locales";

export default function ForgotPassword({
  openModalForgotPassword,
  onOpenChange,
}: {
  openModalForgotPassword: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const tAuth = useTranslations("Auth");
  const tForm = useTranslations("Form");

  const [isSubmitted, setIsSubmitted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const formSchema = createFormSchema();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <Dialog
      open={openModalForgotPassword}
      onOpenChange={(open) => {
        onOpenChange(open); // báo ngược về cha
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tAuth("ForgotPassword")}</DialogTitle>
          <DialogDescription>
            {tAuth("ForgotPasswordDescription")}
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tForm("Email")}</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="text"
                            placeholder="gmail@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={!form.formState.isValid}>
                  {tAuth("ForgotPasswordButton")}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  onClick={() => onOpenChange(false)}
                >
                  {/* <ArrowLeft className="w-4 h-4 mr-2" /> */}
                  Quay lại đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến:
              </p>
              <p className="font-medium text-gray-900"></p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Không thấy email? Kiểm tra thư mục spam hoặc thử lại với địa chỉ
                email khác.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Thử email khác
              </Button>

              <Button
                variant="link"
                onClick={() => onOpenChange(false)} // đóng modal
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
