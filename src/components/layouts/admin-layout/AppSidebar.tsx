"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, Sparkles, Store } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarMenus } from "@/config/nav-config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();
	const { session } = useAuth();

	return (
		<Sidebar collapsible="icon" {...props} className="border-r-0 glass">
			<SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-transparent focus-visible:ring-0"
						>
							<div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 text-primary-foreground transform transition-transform group-hover:scale-110">
								<Store className="size-6 text-white" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight ml-2">
								<span className="truncate font-black text-lg tracking-tighter text-gradient">
									Seagle
								</span>
								<span className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									Workspace
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="px-2 py-4">
				<SidebarGroup>
					<SidebarGroupLabel className="px-4 text-label-caps h-auto py-2">
						Platform
					</SidebarGroupLabel>
					<SidebarMenu className="gap-1">
						{sidebarMenus
							.filter((item) => {
								if (!item.requiredRole) return true;
								return session?.user?.role === item.requiredRole;
							})
							.map((item) => {
								const isActive =
									item.items?.some(
										(subItem) =>
											subItem.url === pathname ||
											pathname.startsWith(subItem.url),
									) || item.isActive;

								return (
									<Collapsible
										key={item.title}
										open={isActive}
										className="group/collapsible"
									>
										<SidebarMenuItem>
											{item.items ? (
												<>
													<CollapsibleTrigger
														render={(props) => (
															<SidebarMenuButton
																tooltip={item.title}
																{...props}
																className={cn(
																	"h-11 px-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 group/btn",
																	isActive &&
																		"bg-primary/10 text-primary font-bold",
																)}
															>
																{item.icon && (
																	<item.icon className="size-5 transition-transform group-hover/btn:scale-110" />
																)}
																<span className="text-sm font-semibold tracking-tight">
																	{item.title}
																</span>
																<ChevronRight className="ml-auto size-4 opacity-40 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 group-hover/btn:opacity-100" />
															</SidebarMenuButton>
														)}
													/>
													<CollapsibleContent>
														<SidebarMenuSub className="ml-4 pl-4 border-l-2 border-primary/10 gap-1 mt-1">
															{item.items
																?.filter((subItem) => {
																	if (!subItem.requiredRole) return true;
																	const role = session?.user?.role;
																	return role === subItem.requiredRole;
																})
																.map((subItem) => (
																	<SidebarMenuSubItem key={subItem.title}>
																		<SidebarMenuSubButton
																			render={(props) => (
																				<Link
																					to={subItem.url}
																					{...props}
																					className="h-9 px-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors font-medium opacity-70 hover:opacity-100"
																					activeProps={{
																						className:
																							"bg-primary/10 text-primary opacity-100 font-bold",
																					}}
																				>
																					<span className="text-xs font-medium">
																						{subItem.title}
																					</span>
																				</Link>
																			)}
																		/>
																	</SidebarMenuSubItem>
																))}
														</SidebarMenuSub>
													</CollapsibleContent>
												</>
											) : (
												<SidebarMenuButton
													// tooltip={item.title}
													className={cn(
														"h-11 px-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 group/btn",
														pathname === item.url &&
															"bg-primary/10 text-primary font-bold",
													)}
													render={
														<Link
															to={item.url}
															activeProps={{
																className:
																	"bg-primary/10 text-primary opacity-100 font-bold",
															}}
														/>
													}
												>
													{item.icon && (
														<item.icon className="size-5 transition-transform group-hover/btn:scale-110" />
													)}
													<span className="text-sm font-semibold tracking-tight">
														{item.title}
													</span>
												</SidebarMenuButton>
											)}
										</SidebarMenuItem>
									</Collapsible>
								);
							})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
