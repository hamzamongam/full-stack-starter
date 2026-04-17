import { implement } from "@orpc/server";
import { prisma } from "@/db";
import type { Context } from "../../../server/orpc/context";
import { createRateLimitMiddleware } from "../../../server/orpc/rate-limit";
import { authContract } from "./auth.contract";
import { AuthRepository } from "./auth.repo";
import { AuthService } from "./auth.service";

const authRepo = new AuthRepository(prisma);
const authService = new AuthService(authRepo);
const os = implement(authContract).$context<Context>();

const loginRateLimit = createRateLimitMiddleware("login");

/**
 * Auth Router implementation.
 * Connects contracts to service handlers for authentication flows.
 */
export const authRouter = os.router({
	/**
	 * Login user with email/password.
	 */
	login: os.login.use(loginRateLimit).handler(async ({ input }) => {
		return await authService.login(input);
	}),
	signUp: os.signUp.handler(async ({ input }) => {
		return await authService.signUp(input);
	}),
	resetPassword: os.resetPassword.handler(async ({ input }) => {
		return await authService.resetPassword(input.token, input.newPassword);
	}),
	changePassword: os.changePassword.handler(async ({ input }) => {
		return await authService.changePassword(input);
	}),
	logout: os.logout.handler(async ({ context }) => {
		return await authService.logout(context.headers);
	}),
});
