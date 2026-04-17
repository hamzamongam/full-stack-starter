// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoist mocks to ensure they are available before the mock factory is executed
const { mockMutate, mockUseOrpcMutation, mockMutationOptions } = vi.hoisted(
	() => {
		const mockMutate = vi.fn();
		const mockUseOrpcMutation = vi.fn().mockReturnValue({
			mutate: mockMutate,
			isPending: false,
		});
		const mockMutationOptions = vi.fn().mockImplementation((opts) => opts);

		return { mockMutate, mockUseOrpcMutation, mockMutationOptions };
	},
);

// Mock dependencies
vi.mock("@/hooks/useOrpcMutation", () => ({
	useOrpcMutation: mockUseOrpcMutation,
}));

vi.mock("@/server/orpc/client", () => ({
	orpc: {
		auth: {
			login: {
				mutationOptions: mockMutationOptions,
			},
		},
	},
}));

// Import the hook AFTER mocking
import { useLoginForm } from "./useLoginForm";

describe("useLoginForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset default implementation
		mockUseOrpcMutation.mockReturnValue({
			mutate: mockMutate,
			isPending: false,
		});
	});

	it("initializes form with default values", () => {
		const { result } = renderHook(() => useLoginForm());

		expect(result.current.form.getValues()).toEqual({
			email: "",
			password: "",
		});
		expect(result.current.isPending).toBe(false);
	});

	it("calls login mutation on submit", async () => {
		const { result } = renderHook(() => useLoginForm());

		const formData = {
			email: "test@example.com",
			password: "password123",
		};

		await act(async () => {
			result.current.handleSubmit(formData);
		});

		expect(mockMutate).toHaveBeenCalledWith(formData);
	});

	it("handles isPending state", () => {
		// Use mockReturnValue to persist across multiple calls if any
		mockUseOrpcMutation.mockReturnValue({
			mutate: mockMutate,
			isPending: true,
		});

		const { result } = renderHook(() => useLoginForm());

		expect(result.current.isPending).toBe(true);
	});

	it("redirects to default url on success when no redirectUrl provided", async () => {
		// Mock window.location
		const originalLocation = window.location;
		delete (window as any).location;
		window.location = { href: "" } as any;

		// Trigger the hook
		renderHook(() => useLoginForm());

		// Get the success callback passed to mutationOptions
		// Check the LAST call because previous tests might have called it
		const mutationOptionsCall =
			mockMutationOptions.mock.calls[
				mockMutationOptions.mock.calls.length - 1
			][0];
		expect(mutationOptionsCall).toHaveProperty("onSuccess");

		// Execute onSuccess
		await mutationOptionsCall.onSuccess();

		expect(window.location.href).toBe("/");

		// Restore window.location
		(window as any).location = originalLocation;
	});

	it("redirects to provided url on success", async () => {
		// Mock window.location
		const originalLocation = window.location;
		delete (window as any).location;
		window.location = { href: "" } as any;

		const redirectUrl = "/dashboard";
		renderHook(() => useLoginForm({ redirectUrl }));

		// Get the success callback passed to mutationOptions
		const mutationOptionsCall =
			mockMutationOptions.mock.calls[
				mockMutationOptions.mock.calls.length - 1
			][0];

		await mutationOptionsCall.onSuccess();

		expect(window.location.href).toBe(redirectUrl);

		// Restore window.location
		(window as any).location = originalLocation;
	});
});
