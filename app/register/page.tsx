"use client";

import { useState } from "react";
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
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const formSchema = z
  .object({
    cid: z
      .string()
      .min(13, { message: "กรุณาหมายเลข 13 หลัก" })
      .max(13, { message: "กรุณาหมายเลข 13 หลัก" }),
    username: z.string().min(5, {
      message: "ความยาวขั่นต่ำ 5 ตัวอักษร",
    }),
    password: z.string().min(10, {
      message: "ความยาวขั่นต่ำ 10 ตัวอักษร",
    }),
    confirmPassword: z.string().min(10, {
      message: "ความยาวขั่นต่ำ 10 ตัวอักษร",
    }),
    name: z.string().min(2, {
      message: "กรุณากรอกชื่อ-สกุล",
    }),
    phone: z.string().min(10, {
      message: "ความยาวขั่นต่ำ 10 ตัวอักษร",
    }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    address: z.string().min(10, {
      message: "กรุณากรอกที่อยู่",
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน", // Passwords do not match
    path: ["confirmPassword"], // Specify the path to the field that should show the error
  });

const RegisterPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cid: "",
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("cid", values.cid);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("role", "USER");
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      const resp = await axios.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = resp.data;
      if (result.success) {
        toast.success(result.message);
        form.reset(); // เคลียร์ข้อมูลในฟอร์มหลังจากส่งข้อมูลสำเร็จ
        setImagePreview(null);
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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ลงทะเบียน</CardTitle>
          <CardDescription>
            แผนกเทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพปัตตานี
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-1"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="cid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมายเลขบัตรประชาชน</FormLabel>
                        <FormControl>
                          <Input
                            maxLength={13}
                            placeholder="กรอกหมายเลขบัตรประชาชน"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ-สกุล</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกชื่อ-สกุล" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อบัญชีผู้ใช้</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกชื่อบัญชีผู้ใช้" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสบัญชีผู้ใช้</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="กรอกรหัสบัญชีผู้ใช้"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ยืนยันรหัสบัญชีผู้ใช้</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="กรอกยืนยันรหัสบัญชีผู้ใช้"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เบอร์ติดต่อ</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="กรอกเบอร์ติดต่อ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="กรอกอีเมล"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ที่อยู่</FormLabel>
                        <FormControl>
                          <Textarea placeholder="กรอกที่อยู่" {...field} />
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
                    render={({ field: { onChange, ...rest } }) => (
                      <FormItem>
                        <FormLabel>รูปภาพโปรไฟล์</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e);
                              onChange(e.target.files);
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                        {imagePreview && (
                          <div className="flex justify-center">
                            <Image
                              src={imagePreview}
                              alt="Preview"
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
                <span className="mr-2">ยืนยัน</span>
                <Save className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;