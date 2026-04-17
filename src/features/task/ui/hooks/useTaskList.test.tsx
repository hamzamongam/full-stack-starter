// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { orpc } from "@/server/orpc/client";
import { useTaskList } from "./useTaskList";

vi.mock("@/server/orpc/client", () => ({
	orpc: {
		task: {
			getAll: {
				queryOptions: vi.fn(),
			},
		},
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("useTaskList", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns query data cleanly mapped to orpc", async () => {
		const mockTasks = [{ id: "1", title: "Test Task" }];

		vi.mocked(orpc.task.getAll.queryOptions).mockReturnValue({
			queryKey: ["task", "getAll"],
			queryFn: () => Promise.resolve(mockTasks),
		} as any);

		const { result } = renderHook(() => useTaskList(), {
			wrapper: createWrapper(),
		});

		// At start, it should query
		expect(result.current.isLoading).toBe(true);

		// Wait for resolution
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual(mockTasks);
	});
});
