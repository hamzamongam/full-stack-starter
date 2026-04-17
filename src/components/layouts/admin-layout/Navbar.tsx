"use client";

import { Bell } from "lucide-react";
import type { FC } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";

const Navbar: FC = () => {
	return (
		<div className="flex flex-1 items-center justify-between gap-4">
			<NavSearch />

			<div className="flex items-center gap-3">
				{/* <QuickActionMenu /> */}
				<ThemeToggle />

				<Button variant="ghost" size="icon" className="rounded-full relative">
					<Bell className="h-5 w-5 text-muted-foreground" />
					<span className="absolute top-2 right-2.5 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
				</Button>

				<div className="h-8 w-px bg-border mx-2" />

				<NavUser />
			</div>
		</div>
	);
};

export default Navbar;
