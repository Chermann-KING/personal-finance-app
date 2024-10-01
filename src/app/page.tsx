"use client";

import { useAuth } from "@/context/AuthContext";
import Illustration from "@/ui/IllustrationAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/overview");
    } else {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen flex bg-beige-100">
      {/* LEFT */}
      <Illustration />
      {/* RIGHT */}
      <div className="w-full h-full flex justify-center items-center px-4 py-6 md:px-10 md:py-8 ">
        <span className="text-preset-1 font-bold">Loading...</span>
      </div>
    </div>
  );
}
