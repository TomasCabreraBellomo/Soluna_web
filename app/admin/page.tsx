"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getCurrentUser() ? "/admin/dashboard" : "/admin/login");
  }, [router]);

  return <div className="min-h-screen bg-soluna-ivory" />;
}
