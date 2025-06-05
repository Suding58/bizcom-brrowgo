"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PageLoading from "@/components/loading-page";
import { UserPlus, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-[length:400%_400%]"></div>

      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>

      {/* Login box */}
      <div className="container md self-center py-10 relative z-20">
        <div
          className="flex justify-center gap-4 p-6 rounded-xl"
        >
          <Button
            className="h-[150px] w-[150px] hover:bg-transparent transition-transform transform hover:scale-110 rounded-xl
    bg-white/10 backdrop-blur-md border border-white/30 shadow-lg flex flex-col items-center justify-center gap-2"
            onClick={() => router.push("/register")}
          >
            <div className="flex flex-col items-center gap-2">
              <UserPlus className="h-20 w-20 text-white" />
              <p className="text-small text-white">ลงทะเบียน</p>
            </div>
          </Button>
          <Button
            className="h-[150px] w-[150px]  hover:bg-transparent transition-transform transform hover:scale-110 rounded-xl
    bg-white/10 backdrop-blur-md border border-white/30 shadow-lg flex flex-col items-center justify-center gap-2"
            onClick={() => router.push("/login")}
          >
            <div className="flex flex-col items-center gap-2">
              <UserRoundCog className="h-20 w-20 text-white" />
              <p className="text-small text-white">สำหรับเจ้าหน้าที่</p>
            </div>
          </Button>
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

export default Home;
