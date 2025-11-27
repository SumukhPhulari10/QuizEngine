"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import db from "@/lib/db"

export default function CreateQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [branch, setBranch] = useState("")
  const [description, setDescription] = useState("")
  const [questionsJson, setQuestionsJson] = useState("[]")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    if (!title || !category || !branch) return
    setIsSaving(true)
    let questions = []
    try {
      questions = JSON.parse(questionsJson)
    } catch (err) {
      questions = []
    }
    const id = `${branch}-${Date.now()}`
    db.upsertQuiz({ id, title, category, branch, description, questions, createdAt: new Date().toISOString() })
    setIsSaving(false)
    router.push("/dashboard/teacher")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Quiz</CardTitle>
            <CardDescription>Quickly add a quiz for a branch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Category / Subject</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Data Structures" />
            </div>
            <div>
              <Label>Branch</Label>
              <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="cse, ece, mechanical" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Questions (JSON)</Label>
              <Textarea
                value={questionsJson}
                onChange={(e) => setQuestionsJson(e.target.value)}
                rows={8}
                placeholder='[ { "id":1, "question":"...", "options":["a","b"], "correctAnswer":0 } ]'
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Quiz"}</Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/teacher')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
