import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {useState} from "react";

interface ConfirmDeleteProps<> {
  openModal: boolean;
  onClose: () => void;
  onConfirm?: (user: any) => void;
  user: any;
  title?: string;
  description_1?: string;
  description_2?: string;
}

export function ConfirmDelete ({
   openModal,
   onClose,
   onConfirm,
   user,
   title = "Xác nhận xóa",
   description_1 = "Bạn có chắc chắn muốn xóa tài khoản này không?",
   description_2 = "Hành động này không thể hoàn tác."
} : ConfirmDeleteProps)
{

  return (
    <AlertDialog open={openModal} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col">
              <span>{description_1}</span>
            <span>{description_2}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2">
          <div className="w-full">
            <AlertDialogCancel className="w-full">Hủy</AlertDialogCancel>
          </div>
          <div className="w-full">
            <AlertDialogAction onClick={()=> onConfirm?.(user)} className="w-full bg-red-600 hover:bg-red-700 text-white">Xóa</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}