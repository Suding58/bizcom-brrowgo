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
import { Save } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(5, {
    message: "ความยาวขั่นต่ำ 5 ตัวอักษร",
  }),
  password: z.string().min(10, {
    message: "ความยาวขั่นต่ำ 10 ตัวอักษร",
  }),
});

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
          <CardDescription>
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

              <Button type="submit" className="w-full">
                <span className="mr-2">เข้าสู่ระบบ</span>
                <Save className="h-4 w-4" />
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ไม่มีบัญชีผู้ใช้ ?
            <Link href="/register" className="underline">
              ลงทะเบียน
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
