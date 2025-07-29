import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SendEmailModalProps<> {
  openModal: boolean;
  onClose: () => void;
  user: any;
}

export function SendEmail ({
                                 openModal,
                                 onClose,
                                 user,
                               } : SendEmailModalProps)
{

  return (
    <Dialog open={openModal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gửi Email</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
}