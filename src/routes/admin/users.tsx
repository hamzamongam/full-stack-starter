import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import UserView from "@/features/user/ui/view/UserView";

const usersSearchSchema = z.object({
	page: z.number().catch(1),
	limit: z.number().catch(10),
});

export const Route = createFileRoute("/admin/users")({
	component: RouteComponent,
	validateSearch: (search) => usersSearchSchema.parse(search),
});

function RouteComponent() {
	return <UserView />;
}
