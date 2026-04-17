import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";
import { ChangePasswordSchema, loginSchema, SignUpSchema } from "./auth.schema";

/**
 * Auth contract definitions.
 * Specifies input/output schemas for authentication procedures.
 */
export const authContract = oc.router({
	login: oc.input(loginSchema).output(SuccessResponseSchema(z.any())),
	signUp: oc.input(SignUpSchema).output(SuccessResponseSchema(z.any())),
	logout: oc.output(SuccessResponseSchema(z.any())),
	changePassword: oc
		.input(ChangePasswordSchema)
		.output(SuccessResponseSchema(z.any())),
	resetPassword: oc
		.input(z.object({ token: z.string(), newPassword: z.string() }))
		.output(SuccessResponseSchema(z.any())),
});
