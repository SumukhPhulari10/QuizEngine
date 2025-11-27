"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Cpu, Clock, ChevronRight, Brain } from "lucide-react"

import db from "@/lib/db"
import { getActiveUser } from "@/lib/profile-storage"

// fallback mock questions if a quiz has no questions yet
const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
  },
]

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const category = params.category as string
  const id = params.id as string
  const [quizData, setQuizData] = useState<any | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const answersRef = useRef(selectedAnswers)

  useEffect(() => {
    answersRef.current = selectedAnswers
  }, [selectedAnswers])

  useEffect(() => {
    const all = db.getQuizzes()
    const quiz = all.find((q) => q.id === id)
    if (quiz) {
      setQuizData(quiz)
      const questions = (quiz.questions && quiz.questions.length ? quiz.questions : FALLBACK_QUESTIONS) as any[]
      setSelectedAnswers(new Array(questions.length).fill(null))
    } else {
      setQuizData(null)
      setSelectedAnswers([])
    }
  }, [id])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    const questions = (quizData?.questions && quizData.questions.length ? quizData.questions : FALLBACK_QUESTIONS) as any[]
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = useCallback(
    (answers?: (number | null)[]) => {
      const sourceAnswers = answers ?? answersRef.current
      const questions = (quizData?.questions && quizData.questions.length ? quizData.questions : FALLBACK_QUESTIONS) as any[]
      const score = sourceAnswers.reduce<number>((acc, answer, index) => {
        if (answer === questions[index].correctAnswer) {
          return acc + 1
        }
        return acc
      }, 0)

      // persist result
      try {
        const active = getActiveUser()
        const resultId = `${id}-${Date.now()}`
        db.addResult({
          id: resultId,
          quizId: id,
          quizTitle: quizData?.title ?? id,
          userEmail: active?.email ?? "guest",
          score,
          total: questions.length,
          takenAt: new Date().toISOString(),
        })
        router.push(`/quiz/${category}/${id}/results?resultId=${resultId}`)
      } catch (err) {
        // fallback redirect
        router.push(`/quiz/${category}/${id}/results?score=${score}&total=${questions.length}`)
      }
    },
    [category, id, router, quizData],
  )

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [handleSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const questions = (quizData?.questions && quizData.questions.length ? quizData.questions : FALLBACK_QUESTIONS) as any[]
  const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0
  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">QuizEngine</span>
            </Link>
            <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-lg font-bold text-accent">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-balance">{question?.question ?? "Question not available."}</h2>

              <RadioGroup
                value={selectedAnswers[currentQuestion]?.toString() ?? ""}
                onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
              >
                <div className="space-y-3">
                  {(question?.options || []).map((option: string, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent/5 ${
                        selectedAnswers[currentQuestion] === index ? "border-accent bg-accent/10" : "border-border"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base text-foreground">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={() => handleSubmit(selectedAnswers)}
                disabled={selectedAnswers.some((answer) => answer === null)}
                size="lg"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Question Navigation */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Question Navigation</h3>
              <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentQuestion === index
                      ? "bg-accent text-accent-foreground"
                      : selectedAnswers[index] !== null
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
