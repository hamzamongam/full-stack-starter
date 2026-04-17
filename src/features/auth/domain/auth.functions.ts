import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/server/auth";

/**
 * Server Function to get the currently authenticated user session.
 * This can be called from both Client and Server components.
 */

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

export const getCurrentUser = createServerFn({
	method: "GET",
}).handler(async (): Promise<AuthSession> => {
	// 1. Get the current web request (TanStack Start utility)
	const headers = getRequestHeaders();

	// 2. Use Better-Auth to validate the session from the request headers/cookies
	try {
		const session = await auth.api.getSession({
			headers,
		});
		console.log(session, "in getCurrentUser");

		// 3. Return the session data (user + session info)
		if (!session) {
			console.log(session, "in getCurrentUser if Not");
			return null;
		}

		return session;
	} catch (error) {
		console.log(error, "in getCurrentUser catch");
		return null;
	}
});

export const userQueryOptions = () =>
	queryOptions({
		queryKey: ["auth-session"],
		queryFn: () => getCurrentUser(),
		staleTime: 5 * 60 * 1000,
	});

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });
	if (!session) {
		throw redirect({ to: "/login" });
	}
	return await next({
		context: {
			user: session.user,
			session: session.session,
		},
	});
});
