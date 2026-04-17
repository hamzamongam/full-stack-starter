// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { BaseInput } from "../input/BaseInput";
import { BaseFormCard } from "./BaseFormCard";
import FormItem from "./BaseFormItem";
import InternalForm from "./InternalForm";
import useBaseForm from "./useBaseForm";

// Logic-less wrapper to use the hook
const TestForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
	const schema = z.object({
		username: z.string().min(3, "Username must be at least 3 chars"),
		email: z.string().email("Invalid email"),
	});

	const [form] = useBaseForm({
		schema,
		defaultValues: {
			username: "",
			email: "",
		},
	});

	return (
		<InternalForm form={form} onSubmit={onSubmit}>
			<BaseFormCard title="User Info" description="Enter details">
				<FormItem name="username" label="Username" required>
					<BaseInput placeholder="Enter username" />
				</FormItem>
				<FormItem name="email" label="Email">
					<BaseInput placeholder="Enter email" />
				</FormItem>
				<button type="submit">Submit</button>
			</BaseFormCard>
		</InternalForm>
	);
};

describe("BaseForms Integration", () => {
	it("renders form correctly", () => {
		render(<TestForm onSubmit={vi.fn()} />);
		expect(screen.getByText("User Info")).toBeInTheDocument();
		expect(screen.getByText("Enter details")).toBeInTheDocument();
		expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
	});

	it("validates input and shows errors", async () => {
		const onSubmit = vi.fn();
		render(<TestForm onSubmit={onSubmit} />);

		const submitBtn = screen.getByText("Submit");
		await userEvent.click(submitBtn);

		// Validation errors should appear
		expect(
			await screen.findByText("Username must be at least 3 chars"),
		).toBeInTheDocument();
		expect(screen.getByText("Invalid email")).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("submits valid data", async () => {
		const onSubmit = vi.fn();
		render(<TestForm onSubmit={onSubmit} />);

		const usernameInput = screen.getByLabelText(/Username/);
		const emailInput = screen.getByLabelText(/Email/);
		const submitBtn = screen.getByText("Submit");

		await userEvent.type(usernameInput, "john_doe");
		await userEvent.type(emailInput, "john@example.com");
		await userEvent.click(submitBtn);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalled();
		});

		expect(onSubmit).toHaveBeenCalledWith(
			{
				username: "john_doe",
				email: "john@example.com",
			},
			expect.anything(),
		);
	});
});
