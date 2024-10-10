"use client";

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
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Save, Album } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "กรุณากรอกชื่อหมวดหมู่",
  }),
});

type ItemCategory = {
  id: number;
  name: string;
};

interface AddEditCategoryFormProps {
  isDefault: boolean;
  item?: ItemCategory | null;
  reLoading: Dispatch<SetStateAction<boolean>>;
}

const AddEditCategoryForm: React.FC<AddEditCategoryFormProps> = ({
  isDefault,
  item,
  reLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
    },
  });

  const addDefault = async () => {
    try {
      const resp = await axios.post("/api/category-items/default");
      const result = resp.data;
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
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      const resp = item
        ? await axios.put(`/api/category-items/${item.id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post("/api/category-items", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      const result = resp.data;
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
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
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Button className="h-8 w-8 p-0">
            <span className="sr-only">{item ? "แก้ไข" : "เพิ่ม"}</span>
            {item ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>

          {isDefault && (
            <Button className="h-8" onClick={addDefault}>
              <Album className="h-4 w-4 mr-2" />
              <span>ค่าเริ่มต้น</span>
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อรายการ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อรายการ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <span className="mr-2">บันทึก</span>
              <Save className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryForm;
