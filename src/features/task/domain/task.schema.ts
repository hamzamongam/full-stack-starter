import z from "zod";

export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

export const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	status: TaskStatusSchema,
	priority: z.enum(["low", "medium", "high"]),
	dueDate: z.date(),
	assignee: z.string(),
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
