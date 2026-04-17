import { useContext } from "react";
import { AuthContext } from "@/features/auth/ui/provider/auth.context";

export const useAuth = () => {
	return useContext(AuthContext);
};
