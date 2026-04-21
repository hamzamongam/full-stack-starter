import { implement } from "@orpc/server";
import { prisma } from "@/db";
import type { Context } from "@/server/orpc/context";
import { requiredAuthMiddleware } from "@/server/orpc/middleware";
import {
	toSuccessResponse,
	toSuccessResponseWithPagination,
} from "@/server/orpc/utils";
import { MediaContract } from "./media.contract";
import { MediaRepository } from "./media.repo";
import { MediaService } from "./media.service";

const os = implement(MediaContract).$context<Context>().use(requiredAuthMiddleware);
const mediaRepo = new MediaRepository(prisma);
const mediaService = new MediaService(mediaRepo);

export const MediaRouter = os.router({
	create: os.create.handler(async ({ input }) => {
		return toSuccessResponse(await mediaService.upload(input.file, input.type));
	}),
	getAll: os.getAll.handler(async ({ input }) => {
		const { data, meta } = await mediaService.getAll(input);
		return toSuccessResponseWithPagination(data, meta);
	}),
	delete: os.delete.handler(async ({ input }) => {
		return toSuccessResponse(await mediaService.delete(input.id));
	}),
});
