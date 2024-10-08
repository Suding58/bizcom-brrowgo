"use client";

import { ItemStatus } from "@prisma/client";
import { useState, Dispatch, useEffect, SetStateAction } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PlusCircle, Pencil, Save } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Item } from "@/interface";

import { toast } from "sonner";
import Image from "next/image";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "กรุณากรอกชื่อ",
  }),
  description: z.string().optional(),
  parcelNumber: z.string().min(1, {
    message: "กรุณากรอกหมายเลขทะเบียน",
  }),
  status: z.string({
    required_error: "กรุณาเลือกสถานะ",
    invalid_type_error: "สถานะไม่ถูกต้อง",
  }),
  image: z
    .any()
    .refine((files) => files?.length <= 1, "กรุณาเลือกรูปภาพ")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `ขนาดไฟล์ต้องไม่เกิน 5MB`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "รองรับไฟล์ .jpg, .jpeg, .png, .webp และ .gif เท่านั้น"
    )
    .optional(),
  categoryId: z
    .number({
      required_error: "กรุณาเลือกหมวดหมู่",
      invalid_type_error: "หมวดหมู่ไม่ถูกต้อง",
    })
    .min(1, {
      message: "กรุณาเลือกหมวดหมู่",
    }),
  typeId: z
    .number({
      required_error: "กรุณาเลือกประเภท",
      invalid_type_error: "ประเภทไม่ถูกต้อง",
    })
    .min(1, {
      message: "กรุณาเลือกประเภท",
    }),
  brandId: z
    .number({
      required_error: "กรุณาเลือกยี่ห้อ",
      invalid_type_error: "ยี่ห้อไม่ถูกต้อง",
    })
    .min(1, {
      message: "กรุณาเลือกยี่ห้อ",
    }),
});

type Category = {
  id: number;
  name: string;
  type: { id: number; name: string }[];
  brand: { id: number; name: string }[];
};

interface AddEditItemFormProps {
  item?: Item | null;
  reLoading: Dispatch<SetStateAction<boolean>>;
}

const AddEditItemForm: React.FC<AddEditItemFormProps> = ({
  item,
  reLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      parcelNumber: item?.parcelNumber || "",
      categoryId: item?.categoryId || 0,
      typeId: item?.typeId || 0,
      brandId: item?.brandId || 0,
      status: item?.status || "AVAILABLE",
    },
  });

  useEffect(() => {
    if (item?.imageUrl) {
      setImagePreview(item.imageUrl); // ตั้งค่า imagePreview ถ้ามีภาพ
    }
  }, [item]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("parcelNumber", values.parcelNumber);
      formData.append("categoryId", values.categoryId.toString());
      formData.append("typeId", values.typeId.toString());
      formData.append("brandId", values.brandId.toString());
      formData.append("status", values.status);

      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      const resp = item
        ? await axios.put(`/api/manage-items/${item.id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await axios.post("/api/manage-items", formData, {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === parseInt(categoryId));
    setSelectedCategory(category || null);
    form.setValue("categoryId", parseInt(categoryId));
    form.setValue("typeId", 0);
    form.setValue("brandId", 0);
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const resp = await axios.get<{ data: Category[] }>("/api/category-items");
      const result = resp.data;
      const categories = result.data;
      setCategories(categories);
      setError(null);

      if (item) {
        const category = categories.find((c) => c.id === item.categoryId);
        setSelectedCategory(category || null);
      }
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchCategories();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0">
          <span className="sr-only">{item ? "แก้ไข" : "เพิ่ม"}</span>
          {item ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div>กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div>เกิดข้อผิดพลาด: {error}</div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-4"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
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
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หมวดหมู่</FormLabel>
                      <Select
                        onValueChange={handleCategoryChange}
                        value={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกหมวดหมู่" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภท</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("typeId", parseInt(value))
                        }
                        value={field.value ? field.value.toString() : undefined}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedCategory?.type.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ยี่ห้อ</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          form.setValue("brandId", parseInt(value))
                        }
                        value={field.value ? field.value.toString() : undefined}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกยี่ห้อ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedCategory?.brand.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status" // Make sure this matches the field name in your form schema
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
                          {Object.values(ItemStatus).map(
                            (
                              status // Map over the Role enum values
                            ) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="parcelNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมายเลขทะเบียน</FormLabel>
                        <FormControl>
                          <Input placeholder="กรอกหมายเลขทะเบียน" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รายละเอียด</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="กรอกรายละเอียด"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รูปภาพโปรไฟล์</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e);
                              field.onChange(e.target.files);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {imagePreview && (
                          <div className="flex justify-center">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              width={50}
                              height={50}
                              className="w-[150px] mt-2 max-w-xs rounded-lg "
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                <span className="mr-2">บันทึก</span>
                <Save className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditItemForm;
