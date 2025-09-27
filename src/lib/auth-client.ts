import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseUrl: "http://localhost:3000",
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, signUp, useSession, emailOtp, verifyEmail } =
  authClient;
