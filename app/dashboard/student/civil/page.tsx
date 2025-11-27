"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard/header";
import { DashboardCards } from "@/components/dashboard/cards";
import SubjectList from "@/components/dashboard/subject-list";
import RoleGuard from "@/components/dashboard/protection";
import DB from "../../../../lib/db";

export default function StudentCivilPage() {
  const subjects = DB.getQuizzes().filter((q) => q.branch === "civil");

  return (
    <RoleGuard allowedRoles={["student"]} requiredBranch="civil">
      <div className="container mx-auto p-4">
        <DashboardHeader />
        <h1 className="text-2xl font-bold mb-2">CIVIL Student Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-4">Quick overview and suggested quizzes for CIVIL.</p>
        <DashboardCards />
        <SubjectList branch="civil" />

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Available Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {subjects.map((s) => (
              <div className="border rounded p-3" key={s.id}>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Category: {s.category}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </RoleGuard>
  );
}
