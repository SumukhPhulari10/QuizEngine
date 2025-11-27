"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import Link from "next/link"
import db from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Cpu, Trophy, RotateCcw, Home, TrendingUp, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function QuizResultsPage() {
  const search = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const category = params.category as string
  const id = params.id as string
  const resultId = search?.get("resultId")
  const [result, setResult] = useState<any | null>(null)

  useEffect(() => {
    if (resultId) {
      const found = db.getResults().find((r) => r.id === resultId)
      if (found) setResult(found)
    }
  }, [resultId])

  const score = result ? result.score : Number.parseInt(search?.get("score") || "0")
  const total = result ? result.total : Number.parseInt(search?.get("total") || "5")
  const percentage = total ? Math.round((score / total) * 100) : 0

  const getPerformanceLevel = (percent: number) => {
    if (percent >= 90) return { level: "Outstanding", color: "text-green-500", bgColor: "bg-green-500" }
    if (percent >= 75) return { level: "Excellent", color: "text-blue-500", bgColor: "bg-blue-500" }
    if (percent >= 60) return { level: "Good", color: "text-yellow-500", bgColor: "bg-yellow-500" }
    if (percent >= 40) return { level: "Fair", color: "text-orange-500", bgColor: "bg-orange-500" }
    return { level: "Needs Improvement", color: "text-red-500", bgColor: "bg-red-500" }
  }

  const performance = getPerformanceLevel(percentage)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuizEngine</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-accent" />
              </div>
              <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              <CardDescription className="text-base">Here's how you performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-6xl font-bold text-foreground mb-2">
                    {score}
                    <span className="text-3xl text-muted-foreground">/{total}</span>
                  </div>
                  <div className="text-2xl font-semibold text-accent">{percentage}%</div>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${performance.bgColor}/10`}>
                  <span className={`text-lg font-bold ${performance.color}`}>{performance.level}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={percentage} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{score}</div>
                    <div className="text-sm text-muted-foreground">Correct Answers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{total - score}</div>
                    <div className="text-sm text-muted-foreground">Incorrect Answers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">+{percentage}</div>
                    <div className="text-sm text-muted-foreground">Score Points</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your quiz performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium text-foreground">Correct Answers</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{score} questions</div>
                    <div className="text-sm text-muted-foreground">{percentage}% accuracy</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-medium text-foreground">Incorrect Answers</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{total - score} questions</div>
                    <div className="text-sm text-muted-foreground">{100 - percentage}% incorrect</div>
                  </div>
                </div>
              </div>

              {percentage >= 75 && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Great job!</strong> You've demonstrated strong understanding of this topic. Keep up the excellent work and challenge yourself with harder quizzes.
                  </p>
                </div>
              )}

              {percentage < 75 && percentage >= 50 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Good effort!</strong> You're making progress, but there's room for improvement. Review the topics you struggled with and try again.
                  </p>
                </div>
              )}

              {percentage < 50 && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Keep learning!</strong> Consider reviewing the fundamentals and practicing more. Don't get discouraged - improvement comes with practice.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/quiz/${category}/${id}`}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Retry Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/quiz/${category}`}>
                <Target className="mr-2 h-5 w-5" />
                More Quizzes
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-5 w-5" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import Link from "next/link"
import db from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function QuizResultsPage() {
  const search = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const category = params.category as string
  const id = params.id as string
  const resultId = search?.get("resultId")
  const [result, setResult] = useState<any | null>(null)


                    <strong>Great job!</strong> You've demonstrated strong understanding of this topic. Keep up the
                    excellent work and challenge yourself with harder quizzes.
                  </p>
                </div>
              )}

              {percentage < 75 && percentage >= 50 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Good effort!</strong> You're making progress, but there's room for improvement. Review the
                    topics you struggled with and try again.
                  </p>
                </div>
              )}

              {percentage < 50 && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Keep learning!</strong> Consider reviewing the fundamentals and practicing more. Don't get
                    discouraged - improvement comes with practice.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/quiz/${category}/${id}`}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Retry Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/quiz/${category}`}>
                <Target className="mr-2 h-5 w-5" />
                More Quizzes
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-5 w-5" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
