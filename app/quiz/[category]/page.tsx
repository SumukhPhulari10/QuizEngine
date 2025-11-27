"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, HelpCircle, Brain } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import db from "@/lib/db"
import { getActiveUser } from "@/lib/profile-storage"

export default function QuizCategoryPageClient() {
  const params = useParams()
  const categoryParam = (params?.category as string) ?? "general"
  const [quizzes, setQuizzes] = useState(() => db.getQuizzes())
  const [filtered, setFiltered] = useState<typeof quizzes>([])

  useEffect(() => {
    // refresh quizzes from storage
    setQuizzes(db.getQuizzes())
  }, [])

  useEffect(() => {
    // Enforce branch-only content for signed-in students.
    const active = getActiveUser()
    if (active && active.role === "student") {
      setFiltered(quizzes.filter((q) => q.branch === active.branch))
    } else {
      // non-students (teacher/admin) can view by category param (branch)
      setFiltered(quizzes.filter((q) => q.branch === categoryParam))
    }
  }, [quizzes, categoryParam])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuizEngine</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryParam.toUpperCase()} Quizzes</h1>
          <p className="text-muted-foreground">Only quizzes for your branch are shown.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">No quizzes available for your branch.</div>
          )}
          {filtered.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{quiz.category ?? "Subject"}</Badge>
                </div>
                <CardTitle className="text-xl text-card-foreground">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>{(quiz.questions || []).length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.duration ?? 30} mins</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/quiz/${quiz.branch ?? categoryParam}/${quiz.id}`}>Start Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
