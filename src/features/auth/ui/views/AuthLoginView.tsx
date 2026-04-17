import type { FC } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LoginForm from "../components/LoginForm";
import { useLoginForm } from "../hooks/useLoginForm";
import AuthLayout from "../layout/AuthLayout";

const AuthLoginView: FC<{ redirectUrl?: string }> = ({ redirectUrl }) => {
	const { form, handleSubmit, isPending } = useLoginForm({ redirectUrl });

	return (
		<AuthLayout>
			<div className="">
				<div className="text-center lg:text-left mb-6">
					<h2 className="text-3xl font-bold tracking-tight text-foreground mb-1">
						Welcome Back
					</h2>
					<p className="text-muted-foreground font-medium">
						Please enter your details to sign in to your account.
					</p>
				</div>
				<LoginForm form={form} onSubmit={handleSubmit} isPending={isPending} />
			</div>
		</AuthLayout>
	);
};

export default AuthLoginView;
