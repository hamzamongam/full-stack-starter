import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

let context:
	| {
			queryClient: QueryClient;
	  }
	| undefined;

export function getContext() {
	if (typeof document === "undefined") {
		// Server: always return a new query client to avoid state leakage across requests
		return { queryClient: new QueryClient() };
	}

	if (context) {
		return context;
	}

	const queryClient = new QueryClient();

	context = {
		queryClient,
	};

	return context;
}

export default function TanStackQueryProvider({
	children,
	client,
}: {
	children: ReactNode;
	client?: QueryClient;
}) {
	const { queryClient } = client ? { queryClient: client } : getContext();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
