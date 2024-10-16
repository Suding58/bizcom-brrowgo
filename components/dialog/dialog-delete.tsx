import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button"; // เปลี่ยนเป็น path ที่ถูกต้องของ Button

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Trash, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface DeleteConfirmationDialogProps {
  open: boolean;
  submiting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface DialogDeleteProps {
  urlAPI: string;
  reLoading: Dispatch<SetStateAction<boolean>>;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  submiting,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogDescription>
            คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={submiting}>
              {submiting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              <span className="ml-2">ยกเลิก</span>
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={submiting}
            >
              {submiting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-2">ยืนยัน</span>
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const DialogDelete: React.FC<DialogDeleteProps> = ({ urlAPI, reLoading }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmiting(true);

      const resp = await axios.delete(urlAPI);
      const result = resp.data;

      setDialogOpen(false);
      if (result.success) {
        toast.success(result.message);
        reLoading(true);
      } else {
        toast.warning(result.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving user:", error);
        toast.error(error.message); // Use error.message for a user-friendly message
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred."); // Fallback error message
      }
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <div>
      <Button
        className="h-8 w-8 p-0"
        variant="destructive"
        onClick={handleDeleteClick}
        disabled={submiting}
      >
        <span className="sr-only">ลบ</span>

        {submiting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        )}
      </Button>
      <DeleteConfirmationDialog
        open={dialogOpen}
        submiting={submiting}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DialogDelete;
