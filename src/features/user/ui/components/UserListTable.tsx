import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { FC } from "react";
import { DataTable } from "@/components/base/datatable";
import { Badge } from "@/components/ui/badge";
import type { TUserOutput } from "../../domain/user.schema";

interface UserListTableProps {
	data: TUserOutput[];
	isLoading: boolean;
	total?: number;
	page?: number;
	limit?: number;
}

const COLUMNS: ColumnDef<TUserOutput>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.original.role;
			let variant: "default" | "secondary" | "destructive" | "outline" =
				"secondary";

			if (role === "superAdmin") variant = "default";
			if (role === "admin") variant = "outline";

			return (
				<Badge variant={variant} className="capitalize">
					{role}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
	},
];

const UserListTable: FC<UserListTableProps> = ({
	data,
	isLoading,
	total = 0,
	page = 1,
	limit = 10,
}) => {
	const navigate = useNavigate();

	return (
		<DataTable
			columns={COLUMNS}
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
					to: "/admin/users",
					search: (prev: any) => ({
						...prev,
						page: nextState.pageIndex + 1,
						limit: nextState.pageSize,
					}),
				});
			}}
		/>
	);
};

export default UserListTable;
