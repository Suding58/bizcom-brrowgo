"use client";
import { TransactionStatus } from "@prisma/client";
import { useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SquarePen, Save, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { TransactionsApprove } from "@/interface";
import { notifyApproveRequest } from "@/utility/notify-format";
import { translateStatus } from "@/utility/item-status";

const formSchema = z.object({
  statusBorrow: z
    .string({
      required_error: "กรุณาเลือกสถานะ",
      invalid_type_error: "สถานะไม่ถูกต้อง",
    })
    .min(1, {
      message: "กรุณาเลือกสถานะ",
    }),
});

interface Props {
  statusBorrow: string;
  transactionId: number;
  reLoading: Dispatch<SetStateAction<boolean>>;
}

const ChangeStatusBorrow: React.FC<Props> = ({
  statusBorrow,
  transactionId,
  reLoading,
}) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [submiting, setSubmiting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statusBorrow: statusBorrow,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmiting(true);
      const formData = new FormData();
      formData.append("statusBorrow", values.statusBorrow);
      formData.append(
        "approvedBorrowId",
        session?.user.id ? session.user.id.toString() : ""
      );

      const resp = await axios.put(
        `/api/transaction-items/${transactionId}/approved/borrow`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = resp.data;
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        reLoading(true);
        const approveRequest = result.data as TransactionsApprove;
        notifyApproveRequest(approveRequest);
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0 bg-violet-500 hover:bg-violet-400">
          <span className="sr-only">เปลี่ยนสถานะการยืม</span>
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เปลี่ยนสถานะการยืม</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="statusBorrow" // Make sure this matches the field name in your form schema
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สถานะ</FormLabel>
                  <Select
                    onValueChange={field.onChange} // Update the form state on value change
                    value={field.value ? field.value.toString() : undefined} // Set the current value
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสถานะ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TransactionStatus).map(
                        (
                          statusBorrow // Map over the Role enum values
                        ) => (
                          <SelectItem key={statusBorrow} value={statusBorrow}>
                            {translateStatus(statusBorrow)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submiting}>
              {submiting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              <span className="ml-2">บันทึก</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStatusBorrow;
