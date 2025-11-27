"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/header";
import { DashboardCards } from "@/components/dashboard/cards";
import SubjectList from "@/components/dashboard/subject-list";
import RoleGuard from "@/components/dashboard/protection";
import DB from "@/lib/db";

export default function TeacherPageLegacy() {
  const subjects = DB.getQuizzes();

  return (
    <RoleGuard allowedRoles={["teacher"]}>
      <div className="container mx-auto p-4">
        <DashboardHeader />
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard - Legacy</h1>
        <p className="text-sm text-muted-foreground mb-4">This is a legacy copy retained for reference.</p>
        <DashboardCards />
        <SubjectList />
      </div>
    </RoleGuard>
  );
}
