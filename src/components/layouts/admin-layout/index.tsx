"use client";

import type { FC, ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import DashboardBreadcrumb from "./DashboardBreadcrumb";
import DashboardFooter from "./DashboardFooter";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
	children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<SidebarProvider>
			<div className="relative flex min-h-screen w-full overflow-hidden bg-background">
				{/* Creative Background Elements */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
					<div className="absolute top-[10%] left-[10%] w-140 h-140 bg-primary/(--blob-opacity) rounded-full blur-[80px] animate-blob filter" />
					<div className="absolute bottom-[10%] right-[10%] w-140 h-140 bg-accent/(--blob-opacity) rounded-full blur-[80px] animate-blob animation-delay-2000 filter" />
					<div className="absolute top-[40%] left-[40%] w-100 h-100 bg-purple-500/(--blob-opacity) rounded-full blur-[80px] animate-blob animation-delay-4000 filter" />
				</div>

				<AppSidebar className="z-20 relative" />

				<SidebarInset className="relative z-10 flex flex-col min-h-screen bg-transparent">
					<header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sticky top-0 glass z-30 transition-all duration-300">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center p-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer sidebar-trigger-container">
								<SidebarTrigger className="h-5 w-5 static!" />
							</div>
							<Separator
								orientation="vertical"
								className="h-4 bg-border/50 hidden sm:block"
							/>
							<DashboardBreadcrumb />
						</div>

						<div className="flex-1 max-w-2xl px-4">
							<Navbar />
						</div>
					</header>

					<main className="flex-1 p-4 md:p-4">
						<div className="w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
							{children}
						</div>
					</main>
					<DashboardFooter />
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default DashboardLayout;
