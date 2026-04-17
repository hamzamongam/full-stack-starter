// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import useTaskForm from "./useTaskForm";

vi.mock("@/server/orpc/client", () => ({
	orpc: {
		task: {
			create: { mutationOptions: vi.fn() },
			update: { mutationOptions: vi.fn() },
			getAll: { queryKey: vi.fn().mockReturnValue(["task", "getAll"]) },
			getById: { queryKey: vi.fn().mockReturnValue(["task", "getById"]) },
		},
	},
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: vi.fn(),
}));

vi.mock("@/hooks/useOrpcMutation", () => ({
	useOrpcMutation: vi.fn(),
}));

describe("useTaskForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const createWrapper = () => {
		const queryClient = new QueryClient();
		return ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};

	it("initializes with default values for a new task creation scope", async () => {
		vi.mocked(useOrpcMutation).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as any);

		const { result } = renderHook(() => useTaskForm(), {
			wrapper: createWrapper(),
		});

		expect(result.current.form.getValues("status")).toBe("pending");
		expect(result.current.form.getValues("priority")).toBe("medium");
	});

	it("forwards the react-hook-form mapped value safely to the underlying create mutation", async () => {
		const createMutateMock = vi.fn();
		let callCount = 0;
		// 1st call per render is Create. 2nd is Update.
		vi.mocked(useOrpcMutation).mockImplementation(() => {
			callCount++;
			return {
				mutate: callCount % 2 !== 0 ? createMutateMock : vi.fn(),
				isPending: false,
			} as any;
		});

		vi.mocked(useNavigate).mockReturnValue(vi.fn() as any);

		const { result } = renderHook(() => useTaskForm(), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			result.current.form.setValue("title", "Integration Engine");
			result.current.form.setValue("description", "Complete Phase 3");
			result.current.form.setValue("assignee", "Admin");
			result.current.form.setValue("priority", "high");

			// Manually simulate form submission pipeline
			await result.current.handleSubmit(result.current.form.getValues() as any);
		});

		expect(createMutateMock).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Integration Engine",
				description: "Complete Phase 3",
				priority: "high",
			}),
		);
	});
});
