import { useRouter } from "@tanstack/react-router";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import InputPassword from "@/components/base/InputPassword";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

const ResetPasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
	token: string;
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ token }) => {
	const { mutate } = useOrpcMutation(
		orpc.auth.resetPassword.mutationOptions({
			onSuccess: () => {
				toast.success("Password reset successfully");
				router.navigate({ to: "/login" });
			},
			onError: (error) => {
				toast.error(error.message || "Failed to reset password");
			},
		}),
	);

	const router = useRouter();
	const [form] = useBaseForm({
		schema: ResetPasswordSchema,
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const handleSubmit: SubmitHandler<ResetPasswordValues> = async (values) => {
		mutate({
			token,
			newPassword: values.newPassword,
		});
	};

	return (
		<div className="grid gap-6">
			<BaseForm form={form} onSubmit={handleSubmit} className="space-y-4">
				<BaseForm.Item
					control={form.control}
					name="newPassword"
					label="New Password"
					required
				>
					<InputPassword placeholder="Enter new password" />
				</BaseForm.Item>
				<BaseForm.Item
					control={form.control}
					name="confirmPassword"
					label="Confirm Password"
					required
				>
					<InputPassword placeholder="Confirm new password" />
				</BaseForm.Item>
				<BaseButton
					type="submit"
					className="w-full"
					// Add loading state if needed
				>
					Set Password
				</BaseButton>
			</BaseForm>
		</div>
	);
};

export default ResetPasswordForm;
