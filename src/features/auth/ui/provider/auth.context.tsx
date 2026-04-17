import { createContext } from "react";
import type { AuthSession } from "../../domain/auth.schema";

export type AuthContextValue = {
	session?: AuthSession | null;
	handleLogout?: () => void;
};

export const AuthContext = createContext<AuthContextValue>({});
