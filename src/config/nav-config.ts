import {
	Image as ImageIcon,
	LayoutDashboard,
	ListTodo,
	type LucideIcon,
	Users,
} from "lucide-react";

import type { FileRouteTypes } from "../routeTree.gen";

type AppUrl = FileRouteTypes["to"] | (string & {});

interface SubMenuItem {
	title: string;
	url: AppUrl;
	requiredRole?: "user" | "admin" | "superAdmin";
}

interface SidebarMenus {
	title: string;
	url: AppUrl;
	icon: LucideIcon;
	isActive?: boolean;
	items?: SubMenuItem[];
	requiredRole?: "user" | "admin" | "superAdmin";
}

export const sidebarMenus: SidebarMenus[] = [
	{
		title: "Dashboard",
		url: "/admin",
		icon: LayoutDashboard,
		isActive: true,
	},
	{
		title: "Users",
		url: "/admin/users",
		icon: Users,
		requiredRole: "superAdmin",
	},
	{
		title: "Tasks",
		url: "/admin/tasks",
		icon: ListTodo,
	},
	{
		title: "Media",
		url: "/admin/media",
		icon: ImageIcon,
	},
];
