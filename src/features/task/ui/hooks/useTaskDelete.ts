import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { confirm } from "@/components/base/dialog/confirm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";

import type { TTaskOutput } from "../../domain/task.schema";

interface DeleteContext {
	previousTasks: TTaskOutput[] | undefined;
	queryKey: readonly unknown[];
}

export const useTaskDelete = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: deleteTask, isPending: isDeleting } = useOrpcMutation(
		orpc.task.delete.mutationOptions({
			onMutate: async (id: string) => {
				const queryKey = orpc.task.getAll.queryKey({
					input: { page: 1, limit: 10 },
				});

				await queryClient.cancelQueries({ queryKey });

				const previousTasks = queryClient.getQueryData<{
					data: TTaskOutput[];
					meta: unknown;
				}>(queryKey);

				queryClient.setQueryData<{ data: TTaskOutput[]; meta: unknown }>(
					queryKey,
					(old) => {
						if (!old) return old;
						return {
							...old,
							data: old.data.filter((task) => task.id !== id),
						};
					},
				);

				return { previousTasks, queryKey } as DeleteContext;
			},
			onError: (_err, _id, context) => {
				if (context?.previousTasks) {
					queryClient.setQueryData(context.queryKey, context.previousTasks);
				}
			},
			onSettled: (_data, _error, _id, context) => {
				if (context?.queryKey) {
					queryClient.invalidateQueries({ queryKey: context.queryKey });
				}
			},
		}),
		{
			successMessage: "Task deleted successfully",
		},
	);

	const handleDelete = useCallback(
		(id: string) => {
			confirm({
				title: "Delete Task",
				description:
					"Are you sure you want to delete this task? This action cannot be undone.",
				confirmText: "Delete",
				variant: "destructive",
				onConfirm: async () => {
					await deleteTask(id);
				},
			});
		},
		[deleteTask],
	);

	return { handleDelete, isDeleting };
};
