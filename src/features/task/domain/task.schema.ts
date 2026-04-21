import z from "zod";
import type { Prisma } from "@/generated/prisma/client";

export type TaskModel = Prisma.TaskGetPayload<{}>;

export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

export const TaskSchema = z.object({
	id: z.string(),
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	status: TaskStatusSchema,
	priority: z.enum(["low", "medium", "high"]),
	dueDate: z.date({ message: "Due date is required" }),
	assignee: z.string().min(1, "Assignee is required"),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateTaskSchema = TaskSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const UpdateTaskSchema = TaskSchema.partial();

export type TTaskOutput = z.infer<typeof TaskSchema>;

export type TCreateTask = z.infer<typeof CreateTaskSchema>;

export type TUpdateTask = z.infer<typeof UpdateTaskSchema>;
