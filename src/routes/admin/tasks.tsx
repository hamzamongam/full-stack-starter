import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import TaskView from "@/features/task/ui/view/TaskView";

const tasksSearchSchema = z.object({
	page: z.number().catch(1),
	limit: z.number().catch(10),
});

export const Route = createFileRoute("/admin/tasks")({
	component: RouteComponent,
	validateSearch: (search) => tasksSearchSchema.parse(search),
});

function RouteComponent() {
	return <TaskView />;
}
