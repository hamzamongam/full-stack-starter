import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import InputPassword from "@/components/base/InputPassword";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import { ChangePasswordSchema } from "../../domain/auth.schema";

const ChangePasswordFormSchema = ChangePasswordSchema.extend({
	confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;

const ChangePasswordForm: FC = () => {
	const { mutate: changePassword, isPending } = useOrpcMutation(
		orpc.auth.changePassword.mutationOptions(),
		{
			successMessage: "Password changed successfully!",
		},
	);

	const [form] = useBaseForm({
		schema: ChangePasswordFormSchema,
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
			revokeOtherSessions: true,
		},
	});

	const handleSubmit: SubmitHandler<ChangePasswordFormValues> = (values) => {
		changePassword({
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
			revokeOtherSessions: values.revokeOtherSessions,
		});
		// Optional: form.reset();
	};

	return (
		<div className="max-w-md w-full">
			<BaseForm form={form} onSubmit={handleSubmit} className="space-y-4">
				<BaseForm.Item
					control={form.control}
					name="currentPassword"
					label="Current Password"
					required
				>
					<InputPassword placeholder="Enter current password" />
				</BaseForm.Item>
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
					label="Confirm New Password"
					required
				>
					<InputPassword placeholder="Confirm new password" />
				</BaseForm.Item>
				<div className="flex justify-end pt-2">
					<BaseButton
						type="submit"
						isLoading={isPending}
						loadingText="Updating..."
					>
						Update Password
					</BaseButton>
				</div>
			</BaseForm>
		</div>
	);
};

export default ChangePasswordForm;
