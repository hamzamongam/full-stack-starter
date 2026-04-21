"use client";

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
import useTaskForm from "../hooks/useTaskForm";
import { TaskForm } from "./TaskForm";

const AddTaskModal: FC = () => {
	const [show, setShow] = React.useState(false);
	const { form, handleSubmit, isPending } = useTaskForm({
		onSuccess: () => {
			setShow(false);
		},
	});
	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogTrigger render={<BaseButton>Add Task</BaseButton>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Task</DialogTitle>
				</DialogHeader>
				<TaskForm
					mode="create"
					form={form}
					handleSubmit={handleSubmit}
					isPending={isPending}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AddTaskModal;
