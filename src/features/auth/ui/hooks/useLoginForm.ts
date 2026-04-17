import type { SubmitHandler } from "react-hook-form";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import { loginSchema, type TLoginSchema } from "../../domain/auth.schema";

export const useLoginForm = ({
	redirectUrl,
}: {
	redirectUrl?: string;
} = {}) => {
	const { mutate: loginMutation, isPending } = useOrpcMutation(
		orpc.auth.login.mutationOptions({
			onSuccess: async ({ data }) => {
				// Force a hard navigation to ensure the session cookie is sent and state is fresh
				if (redirectUrl) {
					window.location.href = redirectUrl;
				} else {
					if (data.role === "admin") {
						window.location.href = "/admin";
					} else {
						window.location.href = "/";
					}
				}
			},
		}),
		{
			successMessage: "Successfully signed in!",
		},
	);

	const [form] = useBaseForm({
		schema: loginSchema,
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit: SubmitHandler<TLoginSchema> = (v) => {
		loginMutation(v);
	};

	return {
		form,
		handleSubmit,
		isPending,
	};
};
