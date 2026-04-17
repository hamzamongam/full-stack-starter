import type { FC } from "react";
import { AppFooter } from "./AppFooter";
import AppHeader from "./AppHeader";

const AppLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<AppHeader />
			<main className="flex-1">{children}</main>
			<AppFooter />
		</div>
	);
};

export default AppLayout;
