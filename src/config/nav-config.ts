import {
	Image as ImageIcon,
	LayoutDashboard,
	ListTodo,
	type LucideIcon,
} from "lucide-react";
import type { FileRouteTypes } from "../routeTree.gen";

type AppUrl = FileRouteTypes["to"] | (string & {});

interface SubMenuItem {
	title: string;
	url: AppUrl;
}

interface SidebarMenus {
	title: string;
	url: AppUrl;
	icon: LucideIcon;
	isActive?: boolean;
	items?: SubMenuItem[];
}

export const sidebarMenus: SidebarMenus[] = [
	{
		title: "Dashboard",
		url: "/admin",
		icon: LayoutDashboard,
		isActive: true,
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
