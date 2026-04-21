import { NotFoundError } from "@/server/errors";
import type { TaskRepository } from "./task.repo";
import type {
	TaskModel,
	TCreateTask,
	TTaskOutput,
	TUpdateTask,
} from "./task.schema";

export class TaskService {
	constructor(private readonly taskRepository: TaskRepository) {}

	async create(data: TCreateTask) {
		const result = await this.taskRepository.create(data);
		return this.formatToOutput(result);
	}

	async update(where: { id: string }, data: TUpdateTask) {
		const result = await this.taskRepository.update(where, data);
		return this.formatToOutput(result);
	}

	async delete(where: { id: string }) {
		const result = await this.taskRepository.delete(where);
		return this.formatToOutput(result);
	}

	async getById(where: { id: string }) {
		const result = await this.taskRepository.getById(where);
		if (!result) throw new NotFoundError("Task not found");
		return this.formatToOutput(result);
	}

	async getAll({ page, limit }: { page: number; limit: number }) {
		const [data, total] = await this.taskRepository.getAll({ page, limit });
		return {
			data: data.map((d) => this.formatToOutput(d)),
			total,
		};
	}

	private formatToOutput(task: TaskModel): TTaskOutput {
		return {
			id: task.id,
			title: task.title,
			description: task.description,
			status: task.status as TTaskOutput["status"],
			priority: task.priority as TTaskOutput["priority"],
			dueDate: task.dueDate,
			assignee: task.assignee,
			createdAt: task.createdAt,
			updatedAt: task.updatedAt,
		};
	}
}
