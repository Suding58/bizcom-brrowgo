"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SquareArrowLeft, LogIn, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(5, {
    message: "ความยาวขั่นต่ำ 5 ตัวอักษร",
  }),
  password: z.string().min(8, {
    message: "ความยาวขั่นต่ำ 8 ตัวอักษร",
  }),
});

const LoginPage = () => {
  const router = useRouter();
  const [submiting, setSubmiting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmiting(true);
      const resp = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (resp?.error) {
        // Display the error message returned from the server
        form.resetField("password");
        toast.warning(resp.error); // Show the error message
      } else if (resp?.ok) {
        form.reset();
        toast.success("เข้าสู่ระบบสำเร็จ");
        router.push("/dashboard");
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
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-[length:400%_400%]"></div>

      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>

      {/* Login box */}
      <div className="container md self-center py-10 relative z-20">
        <Card
          className="mx-auto max-w-sm rounded-xl text-white"
          style={{
            background: "rgba(255, 255, 255, 0.1)",       // ใสโปร่งแสง
            backdropFilter: "blur(15px)",                 // เบลอพื้นหลัง
            WebkitBackdropFilter: "blur(15px)",           // Safari
            border: "1px solid rgba(255, 255, 255, 0.3)", // ขอบโปร่งใส
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",   // เงานุ่ม
          }}
        >
          <CardHeader>
            <div className="flex items-center">
              <Link href="/" className="mr-2">
                <SquareArrowLeft className="h-5 w-5 text-white" />
                {/* Back icon */}
              </Link>
              <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
            </div>
            <CardDescription className="text-white">
              แผนกเทคโนโลยีธุรกิจดิจิทัล วิทยาลัยการอาชีพปัตตานี
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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


                          {...field} />
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

                <Button type="submit" className="w-full" disabled={submiting}>
                  {submiting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  <span className="ml-2">เข้าสู่ระบบ</span>
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              ไม่มีบัญชีผู้ใช้ ?{" "}
              <Link href="/register" className="underline">
                ลงทะเบียน
              </Link>
            </div>
          </CardContent>
        </Card>
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

export default LoginPage;
