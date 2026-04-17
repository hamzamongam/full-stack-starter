import {
	BarChart3,
	Image as ImageIcon,
	LayoutDashboard,
	type LucideIcon,
	Monitor,
	Package,
	Settings,
	ShoppingCart,
	Users,
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
		items: [
			{
				title: "Overview",
				url: "/admin",
			},
		],
	},
	{
		title: "Storefront",
		url: "/admin/storefront",
		icon: Monitor,
		items: [
			{
				title: "Management",
				url: "/admin/storefront",
			},
		],
	},
	{
		title: "Products",
		url: "/admin/products",
		icon: Package,
		items: [
			{
				title: "All Products",
				url: "/admin/products",
			},
			{
				title: "Categories",
				url: "/admin/categories",
			},
			{
				title: "Add Product",
				url: "/admin/products/add",
			},
		],
	},
	{
		title: "Orders",
		url: "/dashboard/orders",
		icon: ShoppingCart,
		items: [
			{
				title: "All Orders",
				url: "/dashboard/orders",
			},
		],
	},
	{
		title: "Customers",
		url: "/dashboard/customers",
		icon: Users,
		items: [
			{
				title: "All Customers",
				url: "/dashboard/customers",
			},
		],
	},
	{
		title: "Analytics",
		url: "/dashboard/analytics",
		icon: BarChart3,
	},
	{
		title: "Media",
		url: "/admin/media",
		icon: ImageIcon,
	},
	{
		title: "Settings",
		url: "/dashboard/settings",
		icon: Settings,
	},
];
