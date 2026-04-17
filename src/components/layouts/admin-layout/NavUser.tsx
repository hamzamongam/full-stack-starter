"use client";

import { useRouteContext, useRouter } from "@tanstack/react-router";
import {
	BadgeCheck,
	Bell,
	CreditCard,
	LogOut,
	Settings,
	Sparkles,
} from "lucide-react";
import type { FC } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";

// import { useAuth } from "@/feature/auth/hooks/useAuth";

const NavUser: FC = () => {
	const { session, handleLogout } = useAuth();
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="rounded-xl px-2 hover:bg-muted gap-2 flex items-center transition-all outline-hidden focus:bg-muted"
					>
						<div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-black shadow-sm">
							{session?.user.name.charAt(0).toUpperCase()}
						</div>
						<div className="hidden sm:block text-left">
							<p className="text-sm font-semibold leading-none">
								{session?.user.name}
							</p>
							<p className="text-label-caps text-muted-foreground! mt-1">
								{session?.user.role}
							</p>
						</div>
					</button>
				}
			/>
			<DropdownMenuContent
				className="w-56 rounded-2xl p-2 glass shadow-2xl border-white/10"
				align="end"
				sideOffset={8}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-white font-black">
								{session?.user.name.charAt(0).toUpperCase()}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{session?.user.name}
								</span>
								<span className="truncate text-xs text-muted-foreground">
									{session?.user.email}
								</span>
							</div>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuGroup className="gap-1 flex flex-col pt-1">
					<DropdownMenuItem className="rounded-xl px-2 py-2 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group">
						<BadgeCheck className="mr-2 size-4 opacity-60 group-hover:opacity-100" />
						<span className="font-medium">Account</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="rounded-xl px-2 py-2 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group">
						<CreditCard className="mr-2 size-4 opacity-60 group-hover:opacity-100" />
						<span className="font-medium">Billing</span>
					</DropdownMenuItem>
					{/* <DropdownMenuItem
						className="rounded-xl px-2 py-2 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group"
						onClick={() => router.navigate({ to: "/dashboard/settings" })}
					>
						<Settings className="mr-2 size-4 opacity-60 group-hover:opacity-100" />
						<span className="font-medium">Settings</span>
					</DropdownMenuItem> */}
					<DropdownMenuItem className="rounded-xl px-2 py-2 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group">
						<Bell className="mr-2 size-4 opacity-60 group-hover:opacity-100" />
						<span className="font-medium">Notifications</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuItem
					className="rounded-xl px-2 py-2 hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer group mt-1"
					// onClick={handleLogout}
				>
					<LogOut className="mr-2 size-4 opacity-60 group-hover:opacity-100" />
					<span className="font-medium">Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default NavUser;
