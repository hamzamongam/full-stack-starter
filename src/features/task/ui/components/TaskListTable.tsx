import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { FC } from "react";
import { DataTable } from "@/components/base/datatable";
import { Badge } from "@/components/ui/badge";
import type { TTaskOutput } from "../../domain/task.schema";
import { TaskActionRow } from "./TaskActionRow";

interface TaskListTableProps {
	data: TTaskOutput[];
	isLoading: boolean;
	total?: number;
	page?: number;
	limit?: number;
}

const TaskListTable: FC<TaskListTableProps> = ({
	data,
	isLoading,
	total = 0,
	page = 1,
	limit = 10,
}) => {
	const navigate = useNavigate();
	const columns = getColumns();

	return (
		<DataTable
			columns={columns}
			data={data}
			isLoading={isLoading}
			manualPagination
			pageCount={Math.ceil(total / limit)}
			paginationState={{
				pageIndex: page - 1,
				pageSize: limit,
			}}
			onPaginationChange={(updater) => {
				const nextState =
					typeof updater === "function"
						? updater({ pageIndex: page - 1, pageSize: limit })
						: updater;

				navigate({
					to: "/admin/tasks",
					search: (prev) => ({
						...prev,
						page: nextState.pageIndex + 1,
						limit: nextState.pageSize,
					}),
				});
			}}
		/>
	);
};

export default TaskListTable;

const getColumns = (): ColumnDef<TTaskOutput>[] => {
	return [
		{
			accessorKey: "title",
			header: "Title",
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.original.status;
				let variant: "default" | "secondary" | "destructive" | "outline" =
					"secondary";

				if (status === "completed") variant = "default";
				if (status === "in-progress") variant = "outline";

				return <Badge variant={variant}>{status}</Badge>;
			},
		},
		{
			accessorKey: "priority",
			header: "Priority",
			cell: ({ row }) => {
				const priority = row.original.priority;
				let variant: "default" | "secondary" | "destructive" | "outline" =
					"outline";

				if (priority === "high") variant = "destructive";
				if (priority === "medium") variant = "default";

				return (
					<Badge variant={variant} className="capitalize">
						{priority}
					</Badge>
				);
			},
		},
		{
			accessorKey: "assignee",
			header: "Assignee",
		},
		{
			accessorKey: "dueDate",
			header: "Due Date",
			cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
		},
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => <TaskActionRow task={row.original} />,
		},
	];
};
