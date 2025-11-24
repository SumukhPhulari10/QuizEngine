import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, ArrowLeft, Clock, HelpCircle, Trophy, Brain } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const quizzes = [
  {
    id: 1,
    title: "Data Structures Fundamentals",
    description: "Arrays, linked lists, stacks, queues, and trees",
    difficulty: "Easy",
    questions: 20,
    duration: 30,
    attempted: false,
    bestScore: null,
  },
  {
    id: 2,
    title: "Advanced Algorithms",
    description: "Sorting, searching, dynamic programming, and greedy algorithms",
    difficulty: "Hard",
    questions: 25,
    duration: 45,
    attempted: true,
    bestScore: 85,
  },
  {
    id: 3,
    title: "Object-Oriented Programming",
    description: "Classes, inheritance, polymorphism, and design patterns",
    difficulty: "Medium",
    questions: 15,
    duration: 25,
    attempted: true,
    bestScore: 92,
  },
  {
    id: 4,
    title: "Database Management Systems",
    description: "SQL, normalization, transactions, and indexing",
    difficulty: "Medium",
    questions: 20,
    duration: 30,
    attempted: false,
    bestScore: null,
  },
  {
    id: 5,
    title: "Operating Systems Concepts",
    description: "Process management, memory, scheduling, and file systems",
    difficulty: "Hard",
    questions: 30,
    duration: 50,
    attempted: false,
    bestScore: null,
  },
  {
    id: 6,
    title: "Computer Networks Basics",
    description: "TCP/IP, routing, protocols, and network security",
    difficulty: "Easy",
    questions: 18,
    duration: 25,
    attempted: true,
    bestScore: 78,
  },
]

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default async function QuizCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const categoryName = category.toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuizEngine</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button & Title */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName} Quizzes</h1>
          <p className="text-muted-foreground">Choose a quiz to test your knowledge</p>
        </div>

        {/* Quiz List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={difficultyColors[quiz.difficulty as keyof typeof difficultyColors]}
                  >
                    {quiz.difficulty}
                  </Badge>
                  {quiz.attempted && quiz.bestScore && (
                    <div className="flex items-center gap-1 text-sm text-accent">
                      <Trophy className="w-4 h-4" />
                      <span className="font-medium">{quiz.bestScore}%</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl text-card-foreground">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.duration} mins</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/quiz/${category}/${quiz.id}`}>{quiz.attempted ? "Retake Quiz" : "Start Quiz"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
