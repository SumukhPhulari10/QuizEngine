"use client"

import React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type DashboardCardsProps = {
  branch?: string
}

const BRANCH_CARD_COPY: Record<
  string,
  { quizzes: string; students: string; highlight: string }
> = {
  cse: {
    quizzes: "28 active CSE quizzes",
    students: "312 Computer Science learners",
    highlight: "Focus on algorithms, systems, and full stack practice.",
  },
  mech: {
    quizzes: "18 mechanical quizzes",
    students: "184 Mechanical learners",
    highlight: "Thermo, CAD, and manufacturing readiness.",
  },
  civil: {
    quizzes: "16 civil quizzes",
    students: "142 Civil learners",
    highlight: "Structures, surveying, and planning boosters.",
  },
  ece: {
    quizzes: "21 ECE quizzes",
    students: "205 Electronics learners",
    highlight: "Signals, VLSI, and embedded focus.",
  },
  aiml: {
    quizzes: "24 AI/ML quizzes",
    students: "238 AI researchers",
    highlight: "Neural nets, NLP, and experimentation.",
  },
  it: {
    quizzes: "20 IT quizzes",
    students: "198 IT professionals",
    highlight: "Cloud, cybersecurity, and automation readiness.",
  },
}

export function DashboardCards({ branch }: DashboardCardsProps = {}) {
  const copy = branch ? BRANCH_CARD_COPY[branch] : undefined

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Branch Quizzes</h3>
          <Button size="sm">View</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {copy ? copy.quizzes : "All quizzes across every branch"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Active Students</h3>
          <Button size="sm">Manage</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {copy ? copy.students : "Track student activity across cohorts"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Highlights</h3>
          <Button size="sm">Review</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {copy ? copy.highlight : "Recent results and progress trends."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
