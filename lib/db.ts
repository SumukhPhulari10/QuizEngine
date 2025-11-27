"use client"

import { StoredUser } from "./profile-storage"

const STUDENTS_KEY = "quiz-engine-students"
const TEACHERS_KEY = "quiz-engine-teachers"
const ADMINS_KEY = "quiz-engine-admins"
const QUIZZES_KEY = "quiz-engine-quizzes"
const RESULTS_KEY = "quiz-engine-results"

const safeParse = <T,>(value: string | null): T | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

const get = <T,>(key: string): T[] => {
  if (typeof window === "undefined") return []
  return safeParse<T[]>(localStorage.getItem(key)) ?? []
}

const set = <T,>(key: string, value: T[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export type Quiz = {
  id: string
  title: string
  category?: string
  branch?: string
  description?: string
  questions?: any[]
  duration?: number
  createdAt?: string
}

export type Result = {
  id: string
  quizId: string
  quizTitle?: string
  userEmail: string
  score: number
  total: number
  takenAt: string
}

// Users
export const getStudents = (): StoredUser[] => get<StoredUser>(STUDENTS_KEY)
export const upsertStudent = (user: StoredUser) => {
  const users = getStudents()
  const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (idx > -1) users[idx] = user
  else users.push(user)
  set(STUDENTS_KEY, users)
}

export const getTeachers = (): StoredUser[] => get<StoredUser>(TEACHERS_KEY)
export const upsertTeacher = (user: StoredUser) => {
  const users = getTeachers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (idx > -1) users[idx] = user
  else users.push(user)
  set(TEACHERS_KEY, users)
}

export const getAdmins = (): StoredUser[] => get<StoredUser>(ADMINS_KEY)
export const upsertAdmin = (user: StoredUser) => {
  const users = getAdmins()
  const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (idx > -1) users[idx] = user
  else users.push(user)
  set(ADMINS_KEY, users)
}

// Quizzes
export const getQuizzes = (): Quiz[] => {
  const quizzes = get<Quiz>(QUIZZES_KEY)
  if (!quizzes || quizzes.length === 0) return ensureDefaultQuizzes()
  return quizzes
}
export const upsertQuiz = (quiz: Quiz) => {
  const quizzes = getQuizzes()
  const idx = quizzes.findIndex((q) => q.id === quiz.id)
  if (idx > -1) quizzes[idx] = quiz
  else quizzes.push(quiz)
  set(QUIZZES_KEY, quizzes)
}

// Results
export const getResults = (): Result[] => get<Result>(RESULTS_KEY)
export const addResult = (result: Result) => {
  const results = getResults()
  results.push(result)
  set(RESULTS_KEY, results)
}

export const clearResultsByEmail = (email: string) => {
  const results = getResults().filter((r) => r.userEmail.toLowerCase() !== email.toLowerCase())
  set(RESULTS_KEY, results)
}

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: "cse-1",
    title: "Data Structures Basics",
    category: "Data Structures",
    branch: "cse",
    description: "Arrays, linked lists, stacks and queues — fundamentals for problem solving.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cse-2",
    title: "Algorithms Intro",
    category: "Algorithms",
    branch: "cse",
    description: "Searching, sorting and complexity analysis for efficient code.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cse-3",
    title: "Operating Systems",
    category: "OS",
    branch: "cse",
    description: "Processes, scheduling, memory management and file systems basics.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cse-4",
    title: "Database Systems",
    category: "Databases",
    branch: "cse",
    description: "Relational models, SQL fundamentals, and transactions.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ece-1",
    title: "Digital Logic",
    category: "Digital Circuits",
    branch: "ece",
    description: "Boolean algebra, gates, combinational and sequential circuits.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mech-1",
    title: "Thermodynamics",
    category: "Thermo",
    branch: "mechanical",
    description: "Energy systems, laws of thermodynamics, and applications.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "civil-1",
    title: "Structural Analysis",
    category: "Structures",
    branch: "civil",
    description: "Statics, load paths, and basic structural computations.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "aiml-1",
    title: "Intro to Neural Networks",
    category: "Neural Networks",
    branch: "ai-ml",
    description: "Perceptrons, backpropagation and simple network architectures.",
    createdAt: new Date().toISOString(),
  },
]

const ensureDefaultQuizzes = () => {
  // read raw storage without triggering getQuizzes to avoid recursion
  const quizzes = get<Quiz>(QUIZZES_KEY)
  if (!quizzes || quizzes.length === 0) {
    set(QUIZZES_KEY, DEFAULT_QUIZZES)
    return DEFAULT_QUIZZES
  }
  return quizzes
}

export const getResultsByEmail = (email: string): Result[] => {
  return getResults().filter((r) => r.userEmail.toLowerCase() === email.toLowerCase())
}

export const getResultsByQuiz = (quizId: string): Result[] => {
  return getResults().filter((r) => r.quizId === quizId)
}

export default {
  getStudents,
  upsertStudent,
  getTeachers,
  upsertTeacher,
  getAdmins,
  upsertAdmin,
  getQuizzes,
  upsertQuiz,
  getResults,
  addResult,
  getResultsByEmail,
  getResultsByQuiz,
  clearResultsByEmail,
  ensureDefaultQuizzes,
}
