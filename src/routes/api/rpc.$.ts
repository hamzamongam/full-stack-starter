import "@/polyfill";

import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { router } from "@/features/router";
import { onGlobalError } from "@/server/orpc/utils";

const rpcHandler = new RPCHandler(router, {
	interceptors: [
		onGlobalError, // Centralized domain error mapping
	],
});

async function handle({ request }: { request: Request }) {
	const { response } = await rpcHandler.handle(request, {
		prefix: "/api/rpc",
		context: {
			headers: request.headers,
		},
	});

	return response ?? new Response("Not Found", { status: 404 });
}
export const Route = createFileRoute("/api/rpc/$")({
	server: {
		handlers: {
			HEAD: handle,
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});
