import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/server/orpc/client";

export const useTaskList = (input: { page?: number; limit?: number } = {}) => {
	return useQuery(
		orpc.task.getAll.queryOptions({
			input: {
				page: input.page ?? 1,
				limit: input.limit ?? 10,
			},
		}),
	);
};
