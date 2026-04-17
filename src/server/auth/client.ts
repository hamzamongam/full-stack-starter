import { createAuthClient } from "better-auth/react";
// import { ac, roles } from "./permissions";

export const authClient = createAuthClient({});

export const { signIn, signUp, signOut, useSession } = authClient;
