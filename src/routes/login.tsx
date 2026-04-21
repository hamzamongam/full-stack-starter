import { createFileRoute } from "@tanstack/react-router";
import { AuthLoginView } from "@/features/auth/ui/views";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AuthLoginView />;
}
