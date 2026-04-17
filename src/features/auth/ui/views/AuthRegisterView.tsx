import type { FC } from "react";
import RegisterForm from "../components/RegisterForm";
import AuthLayout from "../layout/AuthLayout";

const AuthRegisterView: FC = () => {
	return (
		<AuthLayout>
			<div>
				<div className="text-center lg:text-left mb-8">
					<h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
						Create an Account
					</h2>
					<p className="text-muted-foreground font-medium">
						Join your school community and start your journey today.
					</p>
				</div>
				<RegisterForm />
			</div>
		</AuthLayout>
	);
};

export default AuthRegisterView;
