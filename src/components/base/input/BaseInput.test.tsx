// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InputPassword from "../InputPassword";
import { BaseInput } from "./BaseInput";

describe("BaseInput", () => {
	it("renders correctly", () => {
		render(<BaseInput placeholder="Enter text" />);
		expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
	});

	it("handles text input", async () => {
		render(<BaseInput />);
		const input = screen.getByRole("textbox");
		await userEvent.type(input, "Hello");
		expect(input).toHaveValue("Hello");
	});

	it("applies custom classes", () => {
		render(<BaseInput className="custom-class" data-testid="input" />);
		expect(screen.getByTestId("input")).toHaveClass("custom-class");
	});

	it("forwards ref", () => {
		const ref = { current: null };
		render(<BaseInput ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});
});

describe("InputPassword", () => {
	it("renders with type password by default", () => {
		render(<InputPassword placeholder="Password" />);
		const input = screen.getByPlaceholderText("Password");
		expect(input).toHaveAttribute("type", "password");
	});

	it("toggles password visibility", async () => {
		render(<InputPassword placeholder="Password" />);
		const button = screen.getByRole("button");
		const input = screen.getByPlaceholderText("Password");

		// Default hidden
		expect(input).toHaveAttribute("type", "password");

		// Click to show
		await userEvent.click(button);
		expect(input).toHaveAttribute("type", "text");

		// Click to hide
		await userEvent.click(button);
		expect(input).toHaveAttribute("type", "password");
	});
});
