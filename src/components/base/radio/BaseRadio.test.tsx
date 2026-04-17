// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BaseRadio } from "./BaseRadio";

describe("BaseRadio", () => {
	it("renders correctly", () => {
		render(<BaseRadio data-testid="radio" />);
		expect(screen.getByTestId("radio")).toBeInTheDocument();
		expect(screen.getByTestId("radio")).toHaveAttribute("type", "radio");
	});

	it("handles selection", async () => {
		render(<BaseRadio />);
		const radio = screen.getByRole("radio");

		expect(radio).not.toBeChecked();

		await userEvent.click(radio);
		expect(radio).toBeChecked();

		// Clicking again should stay checked for radio
		await userEvent.click(radio);
		expect(radio).toBeChecked();
	});

	it("handles disabled state", async () => {
		render(<BaseRadio disabled />);
		const radio = screen.getByRole("radio");

		expect(radio).toBeDisabled();

		await userEvent.click(radio);
		expect(radio).not.toBeChecked();
	});

	it("applies custom className", () => {
		render(<BaseRadio className="custom-class" data-testid="radio" />);
		expect(screen.getByTestId("radio")).toHaveClass("custom-class");
	});

	it("forwards ref", () => {
		const ref = { current: null };
		render(<BaseRadio ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});
});
