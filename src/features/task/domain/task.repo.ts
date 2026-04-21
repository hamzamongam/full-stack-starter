import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { TCreateTask, TUpdateTask } from "./task.schema";

export class TaskRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(data: TCreateTask) {
		return this.prisma.task.create({ data });
	}

	async update(where: { id: string }, data: TUpdateTask) {
		return this.prisma.task.update({ where, data });
	}

	async delete(where: { id: string }) {
		return this.prisma.task.delete({ where });
	}

	async getById(where: { id: string }) {
		return this.prisma.task.findUnique({ where });
	}

	async getAll({
		page,
		limit,
		orderBy = { createdAt: "desc" },
	}: {
		page: number;
		limit: number;
		orderBy?: Prisma.TaskOrderByWithRelationInput;
	}) {
		const skip = (page - 1) * limit;

		return this.prisma.$transaction([
			this.prisma.task.findMany({
				skip,
				take: limit,
				orderBy,
			}),
			this.prisma.task.count(),
		]);
	}
}
