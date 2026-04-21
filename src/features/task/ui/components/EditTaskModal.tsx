"use client";

import { Pencil } from "lucide-react";
import type { FC } from "react";
import React from "react";
import { BaseButton } from "@/components/base/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { TTaskOutput } from "../../domain/task.schema";
import useTaskForm from "../hooks/useTaskForm";
import { TaskForm } from "./TaskForm";

interface EditTaskModalProps {
	task: TTaskOutput;
}

const EditTaskModal: FC<EditTaskModalProps> = ({ task }) => {
	const [open, setOpen] = React.useState(false);
	const { form, handleSubmit, isPending } = useTaskForm({
		task,
		taskId: task.id,
		onSuccess: () => setOpen(false),
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<BaseButton
						variant="ghost"
						className="size-8 p-0 dark:text-white text-primary hover:text-orange-500 hover:bg-orange-500/10"
					>
						<Pencil className="size-4 dark:text-white" />
					</BaseButton>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
				</DialogHeader>
				<TaskForm
					mode="edit"
					form={form}
					handleSubmit={handleSubmit}
					isPending={isPending}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default EditTaskModal;
