import { createFileRoute } from "@tanstack/react-router";
import { AuthRegisterView } from "@/features/auth/ui/views";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AuthRegisterView />;
}
