import { oc } from "@orpc/contract";
import z from "zod";
import {
	SuccessResponseSchema,
	SuccessResponseWithPaginationSchema,
} from "@/server/orpc/utils";
import { CreateTaskSchema, TaskSchema, UpdateTaskSchema } from "./task.schema";

export const TaskContract = oc.router({
	create: oc
		.input(CreateTaskSchema)
		.output(SuccessResponseSchema(TaskSchema)),
	update: oc
		.input(UpdateTaskSchema.extend({ id: z.string() }))
		.output(SuccessResponseSchema(TaskSchema)),
	delete: oc.input(z.string()).output(SuccessResponseSchema(TaskSchema)),
	getById: oc.input(z.string()).output(SuccessResponseSchema(TaskSchema)),
	getAll: oc
		.input(
			z.object({
				page: z.number().int().min(1).default(1),
				limit: z.number().int().min(1).max(100).default(10),
			}),
		)
		.output(SuccessResponseWithPaginationSchema(z.array(TaskSchema))),
});
