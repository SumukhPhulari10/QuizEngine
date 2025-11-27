"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockSubjects = [
  { id: "cse", title: "Computer Science Engineering" },
  { id: "mech", title: "Mechanical Engineering" },
  { id: "civil", title: "Civil Engineering" },
];

export default function SubjectList({ branch }: { branch?: string }) {
  const subjects = mockSubjects;

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Subjects / Branches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <Card key={s.id}>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{s.title}</h3>
              <Button size="sm">Explore</Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Branch ID: {s.id}</p>
              <div className="mt-3 flex gap-2">
                <Link href={`/dashboard/student/${s.id}`}>
                  <Button size="sm">Student view</Button>
                </Link>
                <Link href={`/dashboard/teacher?branch=${s.id}`}>
                  <Button size="sm">Teacher view</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
