// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BaseCheckbox } from "./BaseCheckbox";

describe("BaseCheckbox", () => {
	it("renders correctly", () => {
		render(<BaseCheckbox />);
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("handles check/uncheck interactions", async () => {
		render(<BaseCheckbox />);
		const checkbox = screen.getByRole("checkbox");

		expect(checkbox).not.toBeChecked();

		await userEvent.click(checkbox);
		expect(checkbox).toBeChecked();

		await userEvent.click(checkbox);
		expect(checkbox).not.toBeChecked();
	});

	it("supports defaultChecked", () => {
		render(<BaseCheckbox defaultChecked />);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});

	it("handles disabled state", async () => {
		render(<BaseCheckbox disabled />);
		const checkbox = screen.getByRole("checkbox");

		expect(checkbox).toHaveAttribute("aria-disabled", "true");

		await userEvent.click(checkbox);
		expect(checkbox).not.toBeChecked();
	});

	it("applies custom className", () => {
		render(<BaseCheckbox className="custom-class" data-testid="checkbox" />);
		expect(screen.getByTestId("checkbox")).toHaveClass("custom-class");
	});
});
