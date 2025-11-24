/// <reference types="react" />
import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cpu, Code, Zap, Trophy, Target, Brain } from "lucide-react"

// Lightweight local Link fallback to avoid depending on 'next/link' in environments where its types are missing
const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
)

// Inline icon placeholders to avoid requiring 'lucide-react' and its type declarations

// Provide a minimal global JSX declaration so TypeScript knows about IntrinsicElements
// (prevents "JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.")
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuizEngine</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">For Engineering Students</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
              Test Your <span className="text-accent">Engineering</span> Skills
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Master your engineering knowledge with interactive quizzes across multiple disciplines. Track your
              progress, compete with peers, and level up your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base font-semibold">
                <Link href="/dashboard">Start Quiz</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base font-semibold bg-transparent">
                <Link href="/login">Login</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Quiz Questions</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <div className="text-3xl font-bold text-foreground">5</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-secondary/20 blur-3xl rounded-full"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                <Code className="w-8 h-8 text-accent" />
                <h3 className="font-semibold text-card-foreground">Computer Science</h3>
                <p className="text-sm text-muted-foreground">Data structures, algorithms, and more</p>
              </Card>
              <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow mt-8">
                <Cpu className="w-8 h-8 text-accent" />
                <h3 className="font-semibold text-card-foreground">Electronics</h3>
                <p className="text-sm text-muted-foreground">Circuits, signals, and systems</p>
              </Card>
              <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                <Brain className="w-8 h-8 text-accent" />
                <h3 className="font-semibold text-card-foreground">AI & ML</h3>
                <p className="text-sm text-muted-foreground">Machine learning fundamentals</p>
              </Card>
              <Card className="p-6 space-y-3 hover:shadow-lg transition-shadow mt-8">
                <Target className="w-8 h-8 text-accent" />
                <h3 className="font-semibold text-card-foreground">Mechanical</h3>
                <p className="text-sm text-muted-foreground">Dynamics, thermodynamics, design</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Everything You Need to Excel</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Our platform provides comprehensive tools to help you master engineering concepts
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your performance with detailed analytics and progress tracking across all categories
              </p>
            </Card>
            <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Difficulty Levels</h3>
              <p className="text-muted-foreground">
                Choose from Easy, Medium, and Hard quizzes to match your skill level and learning goals
              </p>
            </Card>
            <Card className="p-8 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Instant Feedback</h3>
              <p className="text-muted-foreground">
                Get immediate results with detailed explanations to help you learn from every question
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Popular Categories</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Choose from a wide range of engineering disciplines
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: "CSE", icon: Code, count: 120 },
            { name: "ECE", icon: Cpu, count: 95 },
            { name: "Mechanical", icon: Target, count: 88 },
            { name: "Civil", icon: Trophy, count: 72 },
            { name: "AI/ML", icon: Brain, count: 105 },
          ].map((category) => (
            <Card
              key={category.name}
              className="p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
            >
              <category.icon className="w-8 h-8 text-accent" />
              <div>
                <h3 className="font-bold text-lg text-card-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} quizzes</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground text-balance">
            Ready to Level Up Your Skills?
          </h2>
          <p className="text-lg text-primary-foreground/90 text-pretty max-w-2xl mx-auto">
            Join thousands of engineering students who are already improving their knowledge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base font-semibold">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base font-semibold bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">QuizEngine</span>
              </div>
              <p className="text-sm text-muted-foreground">Test your engineering skills and track your progress</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Computer Science
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Mechanical
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2025 QuizEngine. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
