"use client";

import { BaseDatePicker } from "@/components/base/datepicker/BaseDatePicker";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { Textarea } from "@/components/ui/textarea";
import type { UseTaskFormReturn } from "../hooks/useTaskForm";

type TaskFormProps = UseTaskFormReturn & {
	mode?: "create" | "edit";
};

export function TaskForm({ form, handleSubmit, isPending }: TaskFormProps) {
	return (
		<BaseForm
			form={form}
			onSubmit={handleSubmit}
			className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-1 pb-4"
		>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main Column */}
				<div className="md:col-span-2 space-y-6">
					<BaseForm.Card title="Task Details">
						<BaseForm.Item
							control={form.control}
							name="title"
							label="Task Title"
						>
							<BaseInput
								className="bg-input"
								placeholder="e.g. Update user authentication logic"
								disabled={isPending}
							/>
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="description"
							label="Task Description"
						>
							<Textarea
								placeholder="Enter detailed task instructions and acceptance criteria..."
								className="min-h-[120px]"
								disabled={isPending}
							/>
						</BaseForm.Item>
					</BaseForm.Card>
				</div>

				{/* Sidebar Column */}
				<div className="space-y-6">
					<BaseForm.Card title="Settings">
						<BaseForm.Item control={form.control} name="status" label="Status">
							<BaseSelect
								placeholder="Select status"
								disabled={isPending}
								data={[
									{ label: "Pending", value: "pending" },
									{ label: "In Progress", value: "in-progress" },
									{ label: "Completed", value: "completed" },
								]}
							/>
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="priority"
							label="Priority Level"
						>
							<BaseSelect
								placeholder="Select priority"
								disabled={isPending}
								data={[
									{ label: "Low", value: "low" },
									{ label: "Medium", value: "medium" },
									{ label: "High", value: "high" },
								]}
							/>
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="assignee"
							label="Assignee Name"
						>
							<BaseInput placeholder="e.g. John Doe" disabled={isPending} />
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="dueDate"
							label="Due Date"
						>
							<BaseDatePicker disabled={isPending} />
						</BaseForm.Item>
					</BaseForm.Card>
				</div>
			</div>
		</BaseForm>
	);
}
