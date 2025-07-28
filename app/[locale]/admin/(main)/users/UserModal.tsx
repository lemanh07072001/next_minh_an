import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {User, Mail, Loader, EyeOff, Eye} from "lucide-react";
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

import {useEffect, useState} from "react";
import {useForm, useWatch} from "react-hook-form";

import {zodResolver} from "@hookform/resolvers/zod";
import {CreateUserFormData, createUserFormSchema} from "@/app/[locale]/admin/(main)/users/validators/CreateUserForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { renderTemplate } from "@/app/ulti/email";
import {AnimatePresence, motion} from "framer-motion";

import { STATUS_USER } from "@/app/constants/status";
import api from "@/lib/axios";
import {toast} from "sonner";

interface UserModalProps {
  openModalUser: boolean;
  onClose: () => void;
  user: any;
  reloadUser: () => void;
  isMode: "edit" | "create";
}


export default function UserModal({ 
  openModalUser, 
  onClose, 
  user, 
  isMode, 
  reloadUser 
}: UserModalProps) {
  const [isLoading , setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dataStatus = STATUS_USER;
  const defaultStatus = dataStatus[0];

  const [titleModal, setTitleModal] = useState({
    title: "Thêm tài khoản mới",
    description: "Tạo tài khoản mới cho thành viên trong nhóm. Điền đầy đủ thông tin bên dưới.",
  });

  const formSchema = createUserFormSchema();
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: null,
      password: "",
      status: defaultStatus.value,
      welcomeEmail: false,
      passwordChange: false
    },
  });

  const handelOpenModalForgotPassword = (open: boolean) => {
    setShowPassword(open);
  };

  const passwordChange = useWatch({
    control: form.control,
    name: "passwordChange",
  });

  // Hiện dữ liệu khi mở form edit
  useEffect(() => {
    if (isMode === "edit" && user) {
      setTitleModal({
        title: "Cập nhật tài khoản",
        description: "Cập nhật tài khoản cho thành viên trong nhóm. Điền đầy đủ thông tin bên dưới.",
      });

      form.reset({
        name: user?.name,
        email: user?.email,
        phone: user?.profile?.phone,
        status: String(user?.status),
        password: "",
        passwordChange: false,

      });
    }
  }, [isMode, user]);

  const onSubmit = async (data: CreateUserFormData) =>{
    try {
      const welcomeEmail = data?.welcomeEmail;
      let emailTemplate;

      // Template gửi email
      if (welcomeEmail) {
        emailTemplate = renderTemplate("welcome", { name: data.name });
      }

      const mergedData = {
        ...data,
        ...(emailTemplate && {email_template: emailTemplate}),
      };

      let res = null;

      // Nếu isMode là create thì sẽ call api thêm dữ liệu ngược lại thì cập nhật
      if(isMode == "create"){
        res = await api.post("/user/create-user", mergedData);
        
      }else {
        res = await api.post(`/user/edit-user/${user.id}`, mergedData);
      }

      if (res.status === 200) {
        // ✅ Reset form và đóng modal
        form.reset();        // Reset form về defaultValues
        onClose();           // Đóng modal
        // Hiện thông báo thành công
        toast.success("Thành công!", {
          description: res.data.message,
        });

        // 🔄 Reload lại bảng
        await reloadUser()
      }

    }catch (error) {
      console.error(error);
      // Hiện thông báo thất bại
      toast.error("Thất bại", {
        description: "Lỗi hệ thống vui lòng thử lại sau.",
      });
    }
  }

  return (
    <>
      <Dialog open={openModalUser} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {titleModal.title}
            </DialogTitle>
            <DialogDescription>
              {titleModal.description}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                {/* Thông tin cơ bản */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Thông tin cơ bản
                  </div>


                  <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel> Họ và tên <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input
                                    id="name"
                                    placeholder="Nhập họ và tên đầy đủ"
                                    {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel> Email <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@company.com"
                                    {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel> Số điện thoại </FormLabel>
                              <FormControl>
                                <Input
                                    id="phone"
                                    placeholder="0123 456 789"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>

                </div>

                {/* Phân quyền */}
                <div className="space-y-4">
                  {/*<div className="flex items-center gap-2 text-sm font-medium text-gray-700">*/}
                  {/*  <Shield className="w-4 h-4" />*/}
                  {/*  Phân quyền và vai trò*/}
                  {/*</div>*/}

                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataStatus.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {passwordChange && (
                      <motion.div
                        key="password-input"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <>
                                  <div className="flex items-center justify-between">
                                    <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                                  </div>
                                  <div className="relative">
                                    <FormControl>
                                      <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="w-full pr-10"
                                        {...field}
                                      />
                                    </FormControl>
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword((prev) => !prev)}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                  <FormMessage />
                                </>
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>


                </div>

                {/* Cài đặt */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4" />
                    Cài đặt tài khoản
                  </div>

                  <FormField
                      control={form.control}
                      name="welcomeEmail"
                      render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="welcome-email">Gửi email chào mừng</Label>
                              <p className="text-sm text-gray-500">Gửi email hướng dẫn đăng nhập cho người dùng mới</p>
                            </div>
                            <FormControl>
                              <Switch
                                  id="welcome-email"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="passwordChange"
                      render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="password-change">Tự tạo mật khẩu</Label>
                              <p className="text-sm text-gray-500">Mật khẩu mặt định là 12345678</p>
                            </div>
                            <FormControl>
                              <Switch
                                  id="password-change"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                      )}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 mt-4">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
                <Button
                    type="submit"

                    disabled={isLoading}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                        >
                          <Loader className="animate-spin"/>
                        </motion.div>
                    ) : (
                        <motion.span
                            key="label"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                          Xác nhận
                        </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </DialogFooter>
            </form>
          </Form>

        </DialogContent>
      </Dialog>
    </>
  );
}
