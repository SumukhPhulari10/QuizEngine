"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveUser } from "@/lib/profile-storage";

export default function RoleGuard({
  children,
  allowedRoles = [],
  requiredBranch,
}: {
  children: ReactNode;
  allowedRoles?: string[];
  requiredBranch?: string;
}) {
  const [user, setUser] = useState<any>(() => getActiveUser());
  const router = useRouter();

  useEffect(() => {
    const u = user; // read from initialized state

    if (!u) {
      // Not signed in - redirect to login
      router.replace("/login");
      return;
    }

    if (allowedRoles.length && !allowedRoles.includes(u.role)) {
      // Not authorized for this page
      router.replace("/dashboard");
      return;
    }

    if (requiredBranch && u.branch !== requiredBranch) {
      // Branch mismatch
      router.replace(`/dashboard/student/${u.branch}`);
      return;
    }
  }, [router, allowedRoles, requiredBranch, user]);

  if (!user) return null; // show nothing while redirecting

  return <>{children}</>;
}
