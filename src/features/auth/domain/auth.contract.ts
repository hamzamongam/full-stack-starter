import { oc } from "@orpc/contract";
import z from "zod";
import { SuccessResponseSchema } from "@/server/orpc/utils";
import { ChangePasswordSchema, loginSchema, SignUpSchema } from "./auth.schema";

/**
 * Auth contract definitions.
 * Specifies input/output schemas for authentication procedures.
 */
export const authContract = oc.router({
	login: oc
		.input(loginSchema)
		.output(SuccessResponseSchema(z.any()))
		.route({
			path: "/login",
			method: "POST",
			description: "Login user",
			summary: "Login user",
		})
		.errors({
			notFound: {
				message: "User not found",
			},
		})
		.meta({
			inputStructure: {},
		}),
	signUp: oc.input(SignUpSchema).output(SuccessResponseSchema(z.any())).route({
		path: "/sign-up",
		method: "POST",
		description: "Sign up user",
		summary: "Sign up user",
	}),
	logout: oc
		.output(SuccessResponseSchema(z.any()))
		.route({ path: "/logout", method: "POST", description: "Logout user" }),
	changePassword: oc
		.input(ChangePasswordSchema)
		.output(SuccessResponseSchema(z.any()))
		.route({ path: "/change-password" }),
	resetPassword: oc
		.input(z.object({ token: z.string(), newPassword: z.string() }))
		.output(SuccessResponseSchema(z.any()))
		.route({ path: "/reset-password" }),
});
