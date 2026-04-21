import { Eye, Trash } from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import type { TTaskOutput } from "../../domain/task.schema";
import { useTaskDelete } from "../hooks/useTaskDelete";
import EditTaskModal from "./EditTaskModal";

interface TaskRowActionsProps {
	task: TTaskOutput;
}

export const TaskActionRow: FC<TaskRowActionsProps> = ({ task }) => {
	const { handleDelete } = useTaskDelete();

	return (
		<div className="flex items-center gap-2">
			<BaseButton
				variant="ghost"
				className="size-8 p-0 dark:text-white text-primary hover:text-primary hover:bg-primary/10"
				onClick={() => {
					// TODO: Navigate to task details when route is ready
				}}
			>
				<Eye className="size-4 dark:text-white" />
			</BaseButton>

			<EditTaskModal task={task} />

			<BaseButton
				variant="ghost"
				className="size-8 p-0 text-primary hover:text-red-500 hover:bg-red-500/10"
				onClick={() => handleDelete(task.id)}
			>
				<Trash className="size-4 dark:text-white" />
			</BaseButton>
		</div>
	);
};
