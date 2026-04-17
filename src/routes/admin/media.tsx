import { createFileRoute } from "@tanstack/react-router";
import MediaManagementView from "@/features/media/ui/view/MediaManagementView";

export const Route = createFileRoute("/admin/media")({
	component: MediaManagementView,
	staticData: {
		breadcrumb: "Media",
	},
});
