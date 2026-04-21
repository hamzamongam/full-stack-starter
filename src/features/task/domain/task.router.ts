import { implement } from "@orpc/server";
import { prisma } from "@/db";
import { ForbiddenError } from "@/server/errors";
import type { Context } from "@/server/orpc/context";
import { requiredAuthMiddleware } from "@/server/orpc/middleware";
import {
	toSuccessResponse,
	toSuccessResponseWithPagination,
} from "@/server/orpc/utils";
import { TaskContract } from "./task.contract";
import { TaskRepository } from "./task.repo";
import { TaskService } from "./task.service";

const os = implement(TaskContract).$context<Context>().use(requiredAuthMiddleware);

const taskRepository = new TaskRepository(prisma);
const taskService = new TaskService(taskRepository);

export const TaskRouter = os.router({
	create: os.create.handler(async ({ input }) => {
		return toSuccessResponse(await taskService.create(input));
	}),
	update: os.update.handler(async ({ input }) => {
		const { id, ...data } = input;
		if (!id) throw new ForbiddenError("ID is required for update");
		return toSuccessResponse(await taskService.update({ id }, data));
	}),
	delete: os.delete.handler(async ({ input }) => {
		return toSuccessResponse(await taskService.delete({ id: input }));
	}),
	getById: os.getById.handler(async ({ input }) => {
		return toSuccessResponse(await taskService.getById({ id: input }));
	}),
	getAll: os.getAll.handler(async ({ input }) => {
		const { page, limit } = input;
		const { data, total } = await taskService.getAll({ page, limit });
		return toSuccessResponseWithPagination(data, {
			page,
			total,
			totalPages: Math.ceil(total / limit),
		});
	}),
});
