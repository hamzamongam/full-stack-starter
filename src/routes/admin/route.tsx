import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import DashboardLayout from "@/components/layouts/admin-layout";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
	staticData: {
		breadcrumb: "Admin",
	},
	async beforeLoad({ context, location }) {
		if (!context.session) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
});

function RouteComponent() {
	return (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
}
