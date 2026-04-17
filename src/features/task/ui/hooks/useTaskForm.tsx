import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import {
	CreateTaskSchema,
	type TCreateTask,
	type TTaskOutput,
} from "../../domain/task.schema";

interface CreateTaskContext {
	previousTasks: TTaskOutput[] | undefined;
	queryKey: readonly unknown[];
}

interface UpdateTaskContext {
	previousTask: TTaskOutput | undefined;
	queryKey: readonly unknown[];
}

export type UseTaskFormProps = {
	onSuccess?: () => void;
	task?: TTaskOutput;
	taskId?: string;
};

export type UseTaskFormReturn = {
	form: UseFormReturn<TCreateTask>;
	handleSubmit: SubmitHandler<TCreateTask>;
	isPending: boolean;
};

const getDefaultValues = (task?: TTaskOutput): TCreateTask =>
	task
		? {
				title: task.title,
				description: task.description,
				status: task.status,
				priority: task.priority,
				dueDate: new Date(task.dueDate),
				assignee: task.assignee,
			}
		: {
				title: "",
				description: "",
				status: "pending",
				priority: "medium",
				dueDate: new Date(),
				assignee: "",
			};

const useTaskForm = ({
	onSuccess,
	taskId,
	task,
}: UseTaskFormProps = {}): UseTaskFormReturn => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate: createTask, isPending: isCreating } = useOrpcMutation(
		orpc.task.create.mutationOptions({
			onMutate: async (newTask) => {
				const queryKey = orpc.task.getAll.queryKey({ input: { page: 1, limit: 10 } });
				await queryClient.cancelQueries({ queryKey });
				const previousTasks = queryClient.getQueryData<{ data: TTaskOutput[]; meta: unknown }>(queryKey);

				queryClient.setQueryData<{ data: TTaskOutput[]; meta: unknown }>(queryKey, (old) => {
					if (!old) return old;
					return {
						...old,
						data: [
							{
								...newTask,
								id: `temp-id-${Math.random()}`,
								createdAt: new Date(),
								updatedAt: new Date(),
							} as TTaskOutput,
							...old.data,
						],
					};
				});

				return { previousTasks, queryKey } as CreateTaskContext;
			},
			onSuccess: () => {
				onSuccess?.();
				navigate({ to: "/admin/tasks", search: { page: 1, limit: 10 } });
			},
			onError: (_err, _newTask, context) => {
				if (context?.previousTasks) {
					queryClient.setQueryData(context.queryKey, context.previousTasks);
				}
			},
			onSettled: (_data, _error, _variables, context) => {
				if (context?.queryKey) {
					queryClient.invalidateQueries({ queryKey: context.queryKey });
				}
			},
		}),
		{ successMessage: "Task created successfully!" },
	);

	const { mutate: updateTask, isPending: isUpdating } = useOrpcMutation(
		orpc.task.update.mutationOptions({
			onMutate: async (updatedTask) => {
				if (!taskId) return;
				const queryKey = orpc.task.getById.queryKey({ input: taskId });
				await queryClient.cancelQueries({ queryKey });
				const previousTask = queryClient.getQueryData<{ data: TTaskOutput }>(queryKey);

				queryClient.setQueryData<{ data: TTaskOutput }>(queryKey, (old) => {
					if (!old) return old;
					return { data: { ...old.data, ...updatedTask } as TTaskOutput };
				});

				return { previousTask, queryKey } as UpdateTaskContext;
			},
			onSuccess: (data) => {
				onSuccess?.();
				if (taskId) {
					queryClient.setQueryData<{ data: TTaskOutput }>(
						orpc.task.getById.queryKey({ input: taskId }),
						() => data as { data: TTaskOutput },
					);
				}
				navigate({ to: "/admin/tasks", search: { page: 1, limit: 10 } });
			},
			onError: (_err, _updatedTask, context) => {
				if (context?.previousTask) {
					queryClient.setQueryData(context.queryKey, context.previousTask);
				}
			},
			onSettled: () => {
				if (taskId) {
					queryClient.invalidateQueries({
						queryKey: orpc.task.getById.queryKey({ input: taskId }),
					});
				}
				queryClient.invalidateQueries({
					queryKey: orpc.task.getAll.queryKey({ input: { page: 1, limit: 10 } }),
				});
			},
		}),
		{ successMessage: "Task updated successfully!" },
	);

	const defaultValues = useMemo(() => getDefaultValues(task), [task]);

	const [form] = useBaseForm({
		schema: CreateTaskSchema,
		defaultValues,
	});

	useEffect(() => {
		if (task) {
			form.reset(defaultValues);
		}
	}, [task, form, defaultValues]);

	const handleSubmit = useCallback<SubmitHandler<TCreateTask>>(
		async (values) => {
			if (taskId) {
				updateTask({ ...values, id: taskId });
			} else {
				createTask(values);
			}
		},
		[taskId, updateTask, createTask],
	);

	return { form, handleSubmit, isPending: isCreating || isUpdating };
};

export default useTaskForm;
