import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import {
	type AuthSession,
	userQueryOptions,
} from "@/features/auth/domain/auth.functions";
import { AuthProvider } from "@/features/auth/ui/provider/auth.provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import StoreDevtools from "../lib/demo-store-devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	session: AuthSession | null;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.ensureQueryData(
			userQueryOptions(),
		);
		console.log(session, "in Root");
		return { session };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Seagle",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const context = Route.useRouteContext();
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<TanStackQueryProvider client={context.queryClient}>
					<AuthProvider session={context.session}>
						<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
							{children}
						</ThemeProvider>
						<Toaster richColors closeButton position="top-center" />
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								StoreDevtools,
								TanStackQueryDevtools,
							]}
						/>
					</AuthProvider>
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
