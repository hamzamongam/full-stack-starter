// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { confirm } from "@/components/base/dialog/confirm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { useTaskDelete } from "./useTaskDelete";

vi.mock("@/server/orpc/client", () => ({
	orpc: {
		task: {
			delete: { mutationOptions: vi.fn() },
			getAll: { queryKey: vi.fn().mockReturnValue(["task", "getAll"]) },
		},
	},
}));

vi.mock("@/components/base/dialog/confirm", () => ({
	confirm: vi.fn(),
}));

vi.mock("@/hooks/useOrpcMutation", () => ({
	useOrpcMutation: vi.fn(),
}));

describe("useTaskDelete", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const createWrapper = () => {
		const queryClient = new QueryClient();
		return ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};

	it("initializes deletion pipeline accurately without triggering execution", () => {
		vi.mocked(useOrpcMutation).mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as any);

		const { result } = renderHook(() => useTaskDelete(), {
			wrapper: createWrapper(),
		});
		expect(result.current.isDeleting).toBe(false);
	});

	it("should open confirm dialog and execute mutateAsync when confirmed", () => {
		const mutateAsyncMock = vi.fn();
		vi.mocked(useOrpcMutation).mockReturnValue({
			mutateAsync: mutateAsyncMock,
			isPending: false,
		} as any);

		const { result } = renderHook(() => useTaskDelete(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.handleDelete("test-id-123");
		});

		expect(confirm).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Delete Task",
				variant: "destructive",
			}),
		);

		// Execute the onConfirm callback manually to simulate user click
		const confirmFnCtx = vi.mocked(confirm).mock.calls[0]?.[0];
		confirmFnCtx?.onConfirm?.();

		expect(mutateAsyncMock).toHaveBeenCalledWith("test-id-123");
	});
});
