import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseUrl: "http://localhost:3000",
  plugins: [],
});

export const { signIn, signOut, signUp, useSession } = authClient;
