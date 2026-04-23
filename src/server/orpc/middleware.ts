import { ORPCError, os } from "@orpc/server";
import { auth } from "../auth";
import { AppError } from "../errors";
import { logger } from "../logger";

/**
 * baseContext defines the basic structure for all ORPC procedure contexts,
 * requiring at minimum the request headers.
 */
export const baseContext = os.$context<{
	headers: Headers;
}>();

/**
 * appErrorInterceptor is a global interceptor for ORPC handlers (OpenAPI/RPC).
 * It catches domain-specific AppErrors and maps them to transport-specific ORPCErrors.
 * This is the 'best practice' for global error mapping in ORPC.
 */
export const appErrorInterceptor = async ({
	next,
}: {
	next: () => Promise<any>;
}) => {
	try {
		return await next();
	} catch (error) {
		if (error instanceof AppError) {
			throw new ORPCError(error.code as any, {
				message: error.message,
				data: error.details,
			});
		}
		throw error;
	}
};

/**
 * requiredAuthMiddleware ensures that a request is authenticated via Better-Auth.
 * It validates the session and injects the user and schoolId into the context
 * for downstream procedures.
 *
 * @throws {ORPCError} UNAUTHORIZED if the session is missing or invalid.
 */
export const requiredAuthMiddleware = baseContext.middleware(
	async ({ next, context }) => {
		// 1. Validate Better-Auth session
		const session = await auth.api.getSession({
			headers: context.headers,
		});

		if (!session) {
			logger.warn("Authentication attempt failed: no valid session");
			throw new ORPCError("UNAUTHORIZED", { message: "Login required" });
		}

		// 2. Make session information available to all services
		return next({
			context: {
				...context,
				user: session.user,
			},
		});
	},
);

/**
 * requiredSuperAdminMiddleware ensures that the authenticated user has the 'superAdmin' role.
 * It expects to be used after requiredAuthMiddleware in the middleware chain.
 *
 * @throws {ORPCError} FORBIDDEN if the user is not a superAdmin.
 */
export const requiredSuperAdminMiddleware = os.middleware(
	async ({ next, context }) => {
		const user = (context as any).user;
		if (!user || user.role !== "superAdmin") {
			logger.warn(
				{ userId: user?.id, role: user?.role },
				"Access denied: superAdmin role required",
			);
			throw new ORPCError("FORBIDDEN", {
				message: "Super Admin access required",
			});
		}

		return next({
			context,
		});
	},
);
