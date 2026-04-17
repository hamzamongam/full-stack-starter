"use client";

import { Search } from "lucide-react";
import type { FC } from "react";
import { BaseInput } from "@/components/base/input";

const NavSearch: FC = () => {
	return (
		<div className="flex-1 max-w-md hidden md:block">
			<div className="relative group">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
				<BaseInput
					type="search"
					placeholder="Search anything..."
					className="pl-9 w-full bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
				/>
			</div>
		</div>
	);
};

export default NavSearch;
