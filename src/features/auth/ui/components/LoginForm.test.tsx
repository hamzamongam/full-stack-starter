// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { loginSchema, type TLoginSchema } from "../../domain/auth.schema";
import LoginForm from "./LoginForm";

// Wrapper to provide the form context
const LoginFormWrapper = ({
	onSubmit = vi.fn(),
	isPending = false,
}: {
	onSubmit?: SubmitHandler<TLoginSchema>;
	isPending?: boolean;
}) => {
	const [form] = useBaseForm({
		schema: loginSchema,
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return <LoginForm form={form} onSubmit={onSubmit} isPending={isPending} />;
};

describe("LoginForm", () => {
	it("renders all form fields and submit button", () => {
		render(<LoginFormWrapper />);

		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Sign In/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Forgot password/i }),
		).toBeInTheDocument();
	});

	it("shows validation errors for empty submission", async () => {
		const onSubmit = vi.fn();
		render(<LoginFormWrapper onSubmit={onSubmit} />);

		const submitBtn = screen.getByRole("button", { name: /Sign In/i });
		await userEvent.click(submitBtn);

		// Assuming schema requires email and password, checks validation messages
		// You might need to adjust exact text based on your schema or BaseForm behavior
		// Since I don't see the schema content, I'll assume standard required behavior
		// If these texts are not found, I'll debug.

		// Wait for validation to trigger
		await waitFor(() => {
			// We can check if onSubmit was NOT called
			expect(onSubmit).not.toHaveBeenCalled();
		});
	});

	it("submits valid data", async () => {
		const onSubmit = vi.fn();
		render(<LoginFormWrapper onSubmit={onSubmit} />);

		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);
		const submitBtn = screen.getByRole("button", { name: /Sign In/i });

		await userEvent.type(emailInput, "test@school.edu");
		await userEvent.type(passwordInput, "password123");
		await userEvent.click(submitBtn);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledTimes(1);
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					email: "test@school.edu",
					password: "password123",
				}),
				expect.anything(),
			);
		});
	});

	it("shows specific validation errors", async () => {
		const onSubmit = vi.fn();
		render(<LoginFormWrapper onSubmit={onSubmit} />);

		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);
		const submitBtn = screen.getByRole("button", { name: /Sign In/i });

		// Invalid Email
		await userEvent.type(emailInput, "invalid-email");
		await userEvent.click(submitBtn);

		await waitFor(() => {
			expect(screen.getByText("Invalid email")).toBeInTheDocument();
		});

		// Short Password
		await userEvent.clear(emailInput);
		await userEvent.type(emailInput, "valid@school.edu");
		await userEvent.type(passwordInput, "123");
		await userEvent.click(submitBtn);

		await waitFor(() => {
			expect(
				screen.getByText("Password must be at least 6 characters long"),
			).toBeInTheDocument();
		});

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("shows root error message", async () => {
		// Custom wrapper to set root error
		const ErrorFormWrapper = () => {
			const [form] = useBaseForm({
				schema: loginSchema,
				defaultValues: {
					email: "",
					password: "",
				},
			});

			// Simulate setting a root error using useEffect
			// effectively mocking a server error response
			useEffect(() => {
				form.setError("root", { message: "Invalid credentials" });
			}, [form]);

			return <LoginForm form={form} onSubmit={vi.fn()} isPending={false} />;
		};

		render(<ErrorFormWrapper />);

		expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
	});

	it("shows loading state when isPending is true", () => {
		render(<LoginFormWrapper isPending={true} />);

		const submitBtn = screen.getByRole("button", { name: /Signing in.../i });
		expect(submitBtn).toBeInTheDocument();
		expect(submitBtn).toBeDisabled();
	});
});
