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
import { Loader2, Save, SquareArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    password: z.string().min(8, {
      message: "ความยาวขั่นต่ำ 8 ตัวอักษร",
    }),
    confirmPassword: z.string().min(8, {
      message: "ความยาวขั่นต่ำ 8 ตัวอักษร",
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
    address: z.string().min(5, {
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
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submiting, setSubmiting] = useState<boolean>(false);
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
      setSubmiting(true);
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
        router.push("/");
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
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-[length:400%_400%]"></div>

      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>

      {/* Login box */}
      <div className="container md self-center py-10 relative z-20">
        <div className="flex justify-center gap-4 p-2">
          <Card
            className="mx-auto max-w-sm rounded-xl text-white"
            style={{
              background: "rgba(255, 255, 255, 0.15)", // โปร่งแสง
              backdropFilter: "blur(15px)",             // เบลอพื้นหลัง
              WebkitBackdropFilter: "blur(15px)",       // Safari
              border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใสแบบแก้ว
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",  // เงานุ่ม
            }}
          >
            <CardHeader>
              <div className="flex items-center">
                <Link href="/" className="mr-2">
                  <SquareArrowLeft className="h-5 w-5 text-white" />
                </Link>
                <CardTitle className="text-2xl">ลงทะเบียน</CardTitle>
              </div>
              <CardDescription className="text-white">
                แผนกเทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพปัตตานี
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-1">
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
                                style={{
                                  border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                                }}
                                maxLength={13}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* ฟิลด์อื่น ๆ ก็ใช้คลาสเดียวกันนี้ */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อ-สกุล</FormLabel>
                          <FormControl>
                            <Input
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                              }}
                              {...field}
                            />
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
                            <Input
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                              }}
                              {...field}
                            />
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
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                              }}
                              type="password"
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
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                              }}
                              type="password"
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
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                              }}
                              type="tel"
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
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                              }}
                              type="email"
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
                              <Textarea
                                style={{
                                  border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                                }}
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
                                style={{
                                  border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
                                }}
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
                                  className="w-[150px] mt-2 max-w-xs rounded-lg"
                                />
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submiting}>
                    {submiting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    <span className="ml-2">ยืนยัน</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>


      <style jsx>{`
        .animate-gradient {
          animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  );
};

export default RegisterPage;
