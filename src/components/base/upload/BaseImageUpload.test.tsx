// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseImageUpload } from "./BaseImageUpload";

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-url");
global.URL.revokeObjectURL = vi.fn();

describe("BaseImageUpload", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders empty state correctly", () => {
		render(<BaseImageUpload />);
		expect(screen.getByText("Click to upload image")).toBeInTheDocument();
		expect(screen.getByText(/SVG, PNG, JPG or GIF/)).toBeInTheDocument();
	});

	it("renders with initial value (string)", () => {
		render(<BaseImageUpload value="https://example.com/image.jpg" />);
		const img = screen.getByAltText("Preview");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
	});

	it("handles file selection", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<BaseImageUpload onChange={onChange} />,
		);

		const file = new File(["dummy content"], "test.png", { type: "image/png" });
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		expect(input).toBeInTheDocument();

		if (input) {
			await userEvent.upload(input, file);
		}

		expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
		expect(onChange).toHaveBeenCalledWith(file);
		expect(screen.getByAltText("Preview")).toBeInTheDocument();
	});

	it("validates file type", async () => {
		const { container } = render(<BaseImageUpload />);
		const file = new File(["content"], "test.txt", { type: "text/plain" });
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;

		if (input) {
			// Bypass userEvent checks for accept attribute to test the component's validation logic
			fireEvent.change(input, { target: { files: [file] } });
		}

		// Wait for potential async state update if any
		await waitFor(() => {
			expect(
				screen.getByText("Only image files are allowed."),
			).toBeInTheDocument();
		});
	});

	it("removes image", async () => {
		const onChange = vi.fn();
		render(
			<BaseImageUpload
				value="https://example.com/image.jpg"
				onChange={onChange}
			/>,
		);

		const removeBtn = screen.getByRole("button");
		await userEvent.click(removeBtn);
		expect(onChange).toHaveBeenCalledWith(null);
		expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
	});
});
