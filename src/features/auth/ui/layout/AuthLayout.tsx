import { BookOpen, GraduationCap, ShieldCheck, Users } from "lucide-react";
import type { FC, ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return (
		<div className="w-full   h-full flex bg-background overflow-hidden justify-center items-center py-16">
			{children}
		</div>
	);
};

export default AuthLayout;
