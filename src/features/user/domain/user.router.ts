import { implement } from "@orpc/server";
import { prisma } from "@/db";
import type { Context } from "@/server/orpc/context";
import {
	requiredAuthMiddleware,
	requiredSuperAdminMiddleware,
} from "@/server/orpc/middleware";
import { toSuccessResponseWithPagination } from "@/server/orpc/utils";
import { UserContract } from "./user.contract";
import { UserRepository } from "./user.repo";
import { UserService } from "./user.service";

const os = implement(UserContract)
	.$context<Context>()
	.use(requiredAuthMiddleware)
	.use(requiredSuperAdminMiddleware);

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

export const UserRouter = os.router({
	getAll: os.getAll.handler(async ({ input }) => {
		const { page, limit } = input;
		const { data, total } = await userService.getAll({ page, limit });
		return toSuccessResponseWithPagination(data, {
			page,
			total,
			totalPages: Math.ceil(total / limit),
		});
	}),
});
