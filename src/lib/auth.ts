import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    roblox: {
      clientId: process.env.ROBLOX_OAUTH_CLIENT_ID!,
      clientSecret: process.env.ROBLOX_OAUTH_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXTAUTH_URL}/api/auth/callback/roblox`,
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "roblox") {
        // Create or update user with Roblox data
        const robloxUser = await prisma.user.upsert({
          where: { robloxId: user.id },
          update: {
            username: user.name || "Unknown",
            avatar: user.image,
          },
          create: {
            robloxId: user.id,
            username: user.name || "Unknown",
            avatar: user.image,
          },
        })

        return {
          ...user,
          id: robloxUser.id,
        }
      }

      return user
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
  },
})

export type Session = typeof auth.$Infer.Session