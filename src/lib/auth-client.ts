import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  baseURL: "/api/auth",
})

export const {
  signIn,
  signOut,
  useSession,
  getSession,
  signUp,
} = authClient