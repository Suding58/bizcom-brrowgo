"use client";
import { ActionCommand } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, Loader2, Zap } from "lucide-react";
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
import { Input } from "../ui/input";

type Props = {
  itemId: number;
};

const formSchema = z.object({
  action: z
    .string({
      required_error: "กรุณาเลือกคำสั่ง",
      invalid_type_error: "คำสั่งไม่ถูกต้อง",
    })
    .min(1, {
      message: "กรุณาเลือกคำสั่ง",
    }),
  message: z.string().min(0, {
    message: "",
  }),
});

const ItemAddAction = ({ itemId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submiting, setSubmiting] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: "MESSAGE_BOX",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmiting(true);
      const formData = new FormData();
      formData.append("itemId", itemId.toString());
      formData.append("action", values.action);
      formData.append("message", values.message);

      const resp = await axios.post(`/api/manage-items/command`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = resp.data;
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0 bg-yellow-400 hover:bg-yellow-200">
          <span className="sr-only">เพิ่มคำสั่ง</span>
          <Zap className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มคำสั่ง</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 mt-2"
          >
            <FormField
              control={form.control}
              name="action" // Make sure this matches the field name in your form schema
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
                      {Object.values(ActionCommand).map(
                        (
                          action // Map over the Role enum values
                        ) => (
                          <SelectItem key={action} value={action}>
                            {action}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("action") === "MESSAGE_BOX" && (
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ข้อความ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={submiting}>
              {submiting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              <span className="ml-2">เพิ่ม</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemAddAction;
