import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/server/orpc/client";

export const useUserList = (input: { page: number; limit: number }) => {
	return useQuery(
		orpc.user.getAll.queryOptions({
			input,
		}),
	);
};
