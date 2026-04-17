import { oc } from "@orpc/contract";
import z from "zod";
import {
	SuccessResponseSchema,
	SuccessResponseWithPaginationSchema,
} from "@/server/orpc/utils";
import { MediaFilterSchema, MediaSchema, MediaTypeEnum } from "./media.schema";

export const MediaContract = oc.router({
	create: oc
		.input(z.object({ file: z.file(), type: MediaTypeEnum.optional() }))
		.output(SuccessResponseSchema(MediaSchema)),
	getAll: oc
		.input(MediaFilterSchema)
		.output(SuccessResponseWithPaginationSchema(z.array(MediaSchema))),
	delete: oc
		.input(z.object({ id: z.string() }))
		.output(SuccessResponseSchema(MediaSchema)),
});
