import { Link } from "@tanstack/react-router";
import { type FC, useId } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { BaseButton } from "@/components/base/button";
import { BaseCheckbox } from "@/components/base/checkbox";
import BaseForm from "@/components/base/forms";
import InputPassword from "@/components/base/InputPassword";
import { BaseInput } from "@/components/base/input";
import type { TLoginSchema } from "../../domain/auth.schema";
import SocialLoginButtons from "./SocialLoginButtons";

interface LoginFormProps {
	form: UseFormReturn<TLoginSchema>;
	onSubmit: SubmitHandler<TLoginSchema>;
	isPending: boolean;
}

const LoginForm: FC<LoginFormProps> = ({ form, onSubmit, isPending }) => {
	const rememberId = useId();

	return (
		<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<BaseForm form={form} onSubmit={onSubmit}>
				<BaseForm.Item
					control={form.control}
					name="email"
					label="Email Address"
					required
				>
					<BaseInput type="email" placeholder="name@school.edu" />
				</BaseForm.Item>

				<BaseForm.Item
					control={form.control}
					name="password"
					label="Password"
					required
				>
					<InputPassword placeholder="••••••••" />
				</BaseForm.Item>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 group">
						<BaseCheckbox id={rememberId} />
						<label
							htmlFor={rememberId}
							className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer"
						>
							Remember me
						</label>
					</div>
					<a
						href="#forgot-password"
						className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
					>
						Forgot password?
					</a>
				</div>

				{form.formState.errors.root && (
					<p className="text-sm font-medium text-destructive">
						{form.formState.errors.root.message}
					</p>
				)}

				<BaseButton
					variant="default"
					size="lg"
					type="submit"
					className="h-10"
					isLoading={isPending}
					loadingText="Signing in..."
				>
					Sign In
				</BaseButton>

				<SocialLoginButtons />

				<p className="text-center text-sm text-muted-foreground mt-6">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4"
					>
						Register
					</Link>
				</p>
			</BaseForm>
		</div>
	);
};

export default LoginForm;
