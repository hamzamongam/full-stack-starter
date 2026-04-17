import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { BaseButton } from "@/components/base/button";
import BaseForm from "@/components/base/forms";
import useBaseForm from "@/components/base/forms/useBaseForm";
import InputPassword from "@/components/base/InputPassword";
import { Input } from "@/components/ui/input";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import { type SignUpInput, SignUpSchema } from "../../domain/auth.schema";

const RegisterForm: FC = () => {
	const navigate = useNavigate();
	const { mutate: signUp, isPending } = useOrpcMutation(
		orpc.auth.signUp.mutationOptions({
			onSuccess: () => {
				navigate({ to: "/" });
			},
		}),
		{
			successMessage: "Account created successfully!",
		},
	);

	const [form] = useBaseForm({
		schema: SignUpSchema,
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const handleSubmit: SubmitHandler<SignUpInput> = (v) => {
		signUp(v);
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			<BaseForm form={form} onSubmit={handleSubmit}>
				<div className="space-y-5">
					<BaseForm.Item
						control={form.control}
						name="name"
						label="Full Name"
						required
					>
						<Input
							placeholder="John Doe"
							className="h-11 px-4 rounded-xl border-muted-foreground/20 focus:border-indigo-500 focus:ring-indigo-500/20"
						/>
					</BaseForm.Item>

					<BaseForm.Item
						control={form.control}
						name="email"
						label="Email Address"
						required
					>
						<Input
							type="email"
							placeholder="name@school.edu"
							className="h-11 px-4 rounded-xl border-muted-foreground/20 focus:border-indigo-500 focus:ring-indigo-500/20"
						/>
					</BaseForm.Item>

					<BaseForm.Item
						control={form.control}
						name="password"
						label="Create Password"
						required
					>
						<InputPassword
							placeholder="••••••••"
							className="h-11 px-4 rounded-xl border-muted-foreground/20 focus:border-indigo-500 focus:ring-indigo-500/20"
						/>
					</BaseForm.Item>
				</div>

				<BaseButton
					type="submit"
					className="w-full h-11 mt-8  text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
					isLoading={isPending}
					loadingText="Creating account..."
				>
					Create Account
				</BaseButton>

				<p className="text-center text-sm text-muted-foreground mt-8">
					Already have an account?{" "}
					<a
						href="/login"
						className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4"
					>
						Sign In
					</a>
				</p>
			</BaseForm>
		</div>
	);
};

export default RegisterForm;
