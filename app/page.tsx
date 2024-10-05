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
    <main className="flex flex-col h-screen justify-center bg-slate-300">
      <div className="container md self-center py-10">
        <div className="flex justify-center gap-4 p-2">
          <Button
            className="h-[150px] w-[150px] bg-neutral-900 hover:bg-neutral-600 transition-transform transform hover:scale-110"
            onClick={() => router.push("/register")}
          >
            <div className="flex flex-col items-center gap-2">
              <UserPlus className="h-20 w-20 text-white" />
              <p className="text-small text-white">ลงทะเบียน</p>
            </div>
          </Button>
          <Button
            className="h-[150px] w-[150px] bg-cyan-900 hover:bg-cyan-700 transition-transform transform hover:scale-110"
            onClick={() => router.push("/login")}
          >
            <div className="flex flex-col items-center gap-2">
              <UserRoundCog className="h-20 w-20 text-white" />
              <p className="text-small text-white">สำหรับเจ้าหน้าที่</p>
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
