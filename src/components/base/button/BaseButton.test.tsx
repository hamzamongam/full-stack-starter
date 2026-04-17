// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BaseButton } from "./BaseButton";

describe("BaseButton", () => {
	it("renders children correctly", () => {
		render(<BaseButton>Click me</BaseButton>);
		expect(
			screen.getByRole("button", { name: "Click me" }),
		).toBeInTheDocument();
	});

	it("shows loading state correctly", () => {
		render(
			<BaseButton isLoading loadingText="Loading...">
				Click me
			</BaseButton>,
		);
		expect(screen.getByRole("button")).toBeDisabled();
		expect(screen.getByText("Loading...")).toBeInTheDocument();
		expect(screen.queryByText("Click me")).not.toBeInTheDocument();
	});

	it("shows icons correctly", () => {
		const LeftIcon = <span data-testid="left-icon">L</span>;
		const RightIcon = <span data-testid="right-icon">R</span>;
		render(
			<BaseButton leftIcon={LeftIcon} rightIcon={RightIcon}>
				Action
			</BaseButton>,
		);
		expect(screen.getByTestId("left-icon")).toBeInTheDocument();
		expect(screen.getByTestId("right-icon")).toBeInTheDocument();
		expect(screen.getByText("Action")).toBeInTheDocument();
	});

	it("does not show icons when loading", () => {
		const LeftIcon = <span data-testid="left-icon">L</span>;
		render(
			<BaseButton isLoading leftIcon={LeftIcon}>
				Action
			</BaseButton>,
		);
		expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
	});

	it("handles disabled state", () => {
		render(<BaseButton disabled>Disabled</BaseButton>);
		expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
	});
});
