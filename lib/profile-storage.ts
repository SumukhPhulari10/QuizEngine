"use client"

export type StoredUser = {
  name: string
  email: string
  password: string
  role: "student" | "teacher" | "admin"
  branch: string
  yearClass: string
  section?: string
  about?: string
  createdAt: string
}

const USERS_KEY = "quiz-engine-users"
const ACTIVE_KEY = "quiz-engine-active-user"

const safeParse = <T,>(value: string | null): T | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const getStoredUsers = (): StoredUser[] => {
  if (typeof window === "undefined") return []
  return safeParse<StoredUser[]>(localStorage.getItem(USERS_KEY)) ?? []
}

export const upsertUser = (user: StoredUser) => {
  const users = getStoredUsers()
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (existingIndex > -1) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export type ActiveUser = Omit<StoredUser, "password"> & { lastLogin?: string }

export const setActiveUser = (user: ActiveUser) => {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(user))
}

export const getActiveUser = (): ActiveUser | null => {
  if (typeof window === "undefined") return null
  return safeParse<ActiveUser>(localStorage.getItem(ACTIVE_KEY))
}

export const clearActiveUser = () => {
  localStorage.removeItem(ACTIVE_KEY)
}

export const findUserByCredentials = (email: string, password: string): StoredUser | undefined => {
  const users = getStoredUsers()
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase().trim() && user.password === password.trim()
  )
}

