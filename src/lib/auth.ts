import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
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
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: Implement email sending logic here
        // For now, log to console in development
        console.log(`OTP for ${email} (${type}): ${otp}`);

        // In production, you would send the email here
        // Example: await sendEmail(email, `Your OTP: ${otp}`, type);
      },
    }),
  ],
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
