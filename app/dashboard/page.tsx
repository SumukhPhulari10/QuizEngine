import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Code, Cpu, Target, Trophy, Brain, ChevronRight, LogOut, Settings, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const categories = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    shortName: "CSE",
    icon: Code,
    quizCount: 120,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  {
    id: "ece",
    name: "Electronics & Communication",
    shortName: "ECE",
    icon: Cpu,
    quizCount: 95,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: Target,
    quizCount: 88,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
  },
  {
    id: "civil",
    name: "Civil Engineering",
    shortName: "Civil",
    icon: Trophy,
    quizCount: 72,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
  },
  {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    shortName: "AI/ML",
    icon: Brain,
    quizCount: 105,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
  },
]

const recentScores = [
  { category: "CSE", quiz: "Data Structures", score: 85, total: 100, date: "2 days ago" },
  { category: "AI/ML", quiz: "Neural Networks", score: 92, total: 100, date: "3 days ago" },
  { category: "ECE", quiz: "Digital Circuits", score: 78, total: 100, date: "5 days ago" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuizEngine</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback className="bg-accent text-accent-foreground">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Continue your learning journey and track your progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">45</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">82%</div>
              <p className="text-xs text-muted-foreground mt-1">+5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">7 days</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">#142</div>
              <p className="text-xs text-muted-foreground mt-1">Top 15%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Categories Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Categories</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Link key={category.id} href={`/quiz/${category.id}`}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                            <category.icon className={`w-6 h-6 ${category.textColor}`} />
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg text-card-foreground">{category.name}</CardTitle>
                        <CardDescription>{category.quizCount} quizzes available</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">12/{category.quizCount}</span>
                          </div>
                          <Progress value={(12 / category.quizCount) * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Scores Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scores</CardTitle>
                <CardDescription>Your latest quiz results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentScores.map((score, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-foreground">{score.quiz}</p>
                      <p className="text-xs text-muted-foreground">
                        {score.category} • {score.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">{score.score}</p>
                      <p className="text-xs text-muted-foreground">/{score.total}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/history">View All Results</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/practice">
                    <Target className="mr-2 h-4 w-4" />
                    Practice Mode
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/leaderboard">
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/achievements">
                    <Trophy className="mr-2 h-4 w-4" />
                    Achievements
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
