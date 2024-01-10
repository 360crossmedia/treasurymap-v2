"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirectIfNotAuthenticated } from "../helpers/auth";

function ProtectedRoutes({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  let userId;

  if (typeof window !== "undefined") {
    userId = localStorage.getItem("userId");
  }

  useEffect(() => {
    redirectIfNotAuthenticated(userId, pathname, router);
  }, [userId, pathname]);

  return children;
}

export default ProtectedRoutes;
