import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseWithPaginationSchema } from "@/server/orpc/utils";
import { UserSchema } from "./user.schema";

export const UserContract = oc.router({
	getAll: oc
		.input(
			z.object({
				page: z.number().int().min(1).default(1),
				limit: z.number().int().min(1).max(100).default(10),
			}),
		)
		.output(SuccessResponseWithPaginationSchema(z.array(UserSchema))),
});
