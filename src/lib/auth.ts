import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // don't allow user to set role
      },
      robloxUsername: {
        type: "string",
        required: false,
        input: true, // allow user to set during signup
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 604_800, // 7 days in seconds
    updateAge: 86_400, // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes - short-lived cache for performance
    },
  },
  callbacks: {
    afterSignIn: (user: { role: string }, _request: unknown) => {
      const role = user.role as string;

      if (role === "USER") {
        return {
          redirect: "/app",
        };
      }
      if (role === "MIDDLEMAN") {
        return {
          redirect: "/middleman",
        };
      }
      if (role === "ADMIN") {
        return {
          redirect: "/admin",
        };
      }

      return {
        redirect: "/app",
      };
    },
  },
});
