"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProfileInfo() {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      setUserInfo({
        name: profile?.full_name || "",
        email: profile?.email || "",
      });
    };

    load();
  }, []);

  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium leading-none">{userInfo.name || "User"}</p>
      <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
    </div>
  );
}
