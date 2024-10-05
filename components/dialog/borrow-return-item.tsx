"use client";

import { Dispatch, SetStateAction, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Save, ClipboardList, ClipboardCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const formSchema = z.object({
  cid: z
    .string()
    .min(13, { message: "กรุณาหมายเลข 13 หลัก" })
    .max(13, { message: "กรุณาหมายเลข 13 หลัก" }),
});

interface Props {
  type: string;
  itemId: number;
  reLoading: Dispatch<SetStateAction<boolean>>;
}

const BorrowReturnItemForm: React.FC<Props> = ({ type, itemId, reLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cid: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("cid", values.cid);

      const resp =
        type === "AVAILABLE"
          ? await axios.post(
              `/api/manage-items/transaction/borrow/${itemId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          : await axios.put(
              `/api/manage-items/transaction/return/${itemId}`,
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
      } else {
        toast.warning(result.message);
      }
    } catch (error: any) {
      console.error("Error saving item:", error);
      toast.error(error.toString());
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          {type === "AVAILABLE" ? (
            <ClipboardList className="h-4 w-4" />
          ) : (
            <ClipboardCheck className="h-4 w-4" />
          )}
          <span className="ml-2">{type === "AVAILABLE" ? "ยืม" : "คืน"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>{type === "AVAILABLE" ? "ยืม" : "คืน"}</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="cid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสประจำตัวประชาชน</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={13}
                      placeholder="กรอกรหัสประจำตัวประชาชน 13 หลัก"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <span className="mr-2">ยืนยัน</span>
              <Save className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowReturnItemForm;
