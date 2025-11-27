"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import Link from "next/link"
import db from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export default function QuizResultsPage() {
  const search = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const category = (params?.category as string) ?? "general"
  const id = (params?.id as string) ?? ""
  const resultId = search?.get("resultId")
  const [result, setResult] = useState<any | null>(null)

  useEffect(() => {
    if (!resultId) return
    const found = db.getResults().find((r) => r.id === resultId)
    if (found) setResult(found)
  }, [resultId])

  // fallback to query params if result is not persisted
  const score = result?.score ?? Number.parseInt(search?.get("score") || "0")
  const total = result?.total ?? Number.parseInt(search?.get("total") || "0")
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  if (!result && !search?.get("score") && !resultId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Result Not Found</CardTitle>
            <CardDescription>No result was located from the query string or saved data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/dashboard`)}>Dashboard</Button>
              <Button onClick={() => router.back()} variant="outline">Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-accent" />
              <CardTitle>Quiz Result</CardTitle>
            </div>
            <CardDescription>Summary of your quiz attempt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold">{score}/{total}</div>
              <div className="text-sm text-muted-foreground mt-1">{percentage}%</div>
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <Button onClick={() => router.push(`/quiz/${category}/${id}`)}>Retry Quiz</Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
