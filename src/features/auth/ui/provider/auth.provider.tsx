import { confirm } from "@/components/base/dialog/confirm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import { AuthSessionSchema } from "../../domain/auth.schema";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({
	children,
	session,
}: {
	children: React.ReactNode;
	session?: any;
}) => {
	const { mutateAsync: logout, isPending } = useOrpcMutation(
		orpc.auth.logout.mutationOptions({
			onSuccess: async () => {
				// await router.navigate({ to: "/login", replace: true });
				window.location.reload();
			},
		}),
		{
			successMessage: "Successfully logged out",
		},
	);

	const parceSession = () => {
		if (!session) return null;
		return AuthSessionSchema.parse(session);
	};

	const handleLogout = async () => {
		confirm({
			title: "Logout",
			description: "Are you sure you want to logout?",
			onConfirm: async () => {
				await logout({});
			},
		});
	};

	return (
		<AuthContext value={{ session: parceSession(), handleLogout }}>
			{children}
		</AuthContext>
	);
};
