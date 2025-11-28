"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type SubjectMeta = {
  id: string
  title: string
  highlight: string
  focusAreas: string[]
}

const SUBJECT_META: SubjectMeta[] = [
  {
    id: "cse",
    title: "Computer Science Engineering",
    highlight: "Systems design, algorithms, and modern software practices.",
    focusAreas: ["Data Structures", "Algorithms", "Operating Systems"],
  },
  {
    id: "mech",
    title: "Mechanical Engineering",
    highlight: "Mechanical systems, thermodynamics, and design thinking.",
    focusAreas: ["Thermodynamics", "Fluid Mechanics", "Design of Machines"],
  },
  {
    id: "civil",
    title: "Civil Engineering",
    highlight: "Infrastructure analysis, surveying, and construction planning.",
    focusAreas: ["Structural Analysis", "Surveying", "Concrete Technology"],
  },
  {
    id: "ece",
    title: "Electronics & Communication Engineering",
    highlight: "Digital & analog systems, VLSI, and signal processing.",
    focusAreas: ["Digital Circuits", "Communication Systems", "Microprocessors"],
  },
  {
    id: "aiml",
    title: "AI & Machine Learning",
    highlight: "Applied AI, deep learning, and experimentation pipelines.",
    focusAreas: ["Neural Networks", "NLP", "Computer Vision"],
  },
  {
    id: "it",
    title: "Information Technology",
    highlight: "Enterprise systems, cloud tooling, and automation.",
    focusAreas: ["Cloud Basics", "Cybersecurity", "DevOps"],
  },
]

type SubjectListProps = {
  branch?: string
  viewerRole?: string
  viewerBranch?: string
}

export default function SubjectList({ branch, viewerRole, viewerBranch }: SubjectListProps) {
  const normalizedViewerBranch = viewerBranch?.toLowerCase()
  const normalizedBranch = branch?.toLowerCase()
  const isStudent = viewerRole === "student"
  const effectiveBranch = isStudent ? normalizedViewerBranch || normalizedBranch : normalizedBranch

  let subjects = SUBJECT_META
  if (effectiveBranch) {
    subjects = SUBJECT_META.filter((subject) => subject.id === effectiveBranch)
  } else if (isStudent) {
    subjects = []
  }

  const showManagementLinks = viewerRole && viewerRole !== "student"

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Subjects / Branches</h2>
      {subjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No subjects available for this branch yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">{subject.title}</h3>
                  <p className="text-xs text-muted-foreground">{subject.highlight}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Focus:</span> {subject.focusAreas.join(" • ")}
                </div>
                {showManagementLinks && (
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/student/${subject.id}/dashboard`}>
                      <Button size="sm" variant="secondary">
                        Student view
                      </Button>
                    </Link>
                    <Link href={`/dashboard/teacher?branch=${subject.id}`}>
                      <Button size="sm">Teacher view</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
