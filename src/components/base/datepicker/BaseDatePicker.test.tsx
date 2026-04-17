// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BaseDatePicker } from "./BaseDatePicker";

describe("BaseDatePicker", () => {
	it("renders with placeholder correctly", () => {
		render(<BaseDatePicker placeholder="Pick a date" />);
		// The button should be visible (as the trigger)
		expect(screen.getByRole("button")).toBeInTheDocument();
		// The placeholder text should be visible
		expect(screen.getByText("Pick a date")).toBeInTheDocument();
	});

	it("renders formatted date when value is provided", () => {
		const testDate = new Date(2023, 9, 15); // October 15, 2023
		render(<BaseDatePicker value={testDate} />);
		// PPP format for Oct 15 2023 is usually "October 15th, 2023"
		expect(screen.getByText(/October 15.*2023/)).toBeInTheDocument();
	});

	it("disables the trigger when disabled prop is true", () => {
		render(<BaseDatePicker disabled />);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("opens calendar popover on click", async () => {
		render(<BaseDatePicker />);
		const trigger = screen.getByRole("button");
		expect(trigger).toHaveAttribute("aria-expanded", "false");

		fireEvent.click(trigger);

		// After click, it should open.
		// Note: Base UI Popover might behave slightly differently but usually sets aria-expanded.
		// Also the content should appear.
		expect(trigger).toHaveAttribute("aria-expanded", "true");
		// Check for calendar element or something inside the content
		// The calendar likely has role "grid" or similar, or we can check for text.
		// But verifying aria-expanded is a good first step for interaction.
	});
});
