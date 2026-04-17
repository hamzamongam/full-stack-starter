import type { ColumnDef } from "@tanstack/react-table";
import type { FC } from "react";
import { DataTable } from "@/components/base/datatable";
import type { TProduct } from "../../domain/product.schema";
import { ProductActionRow } from "./ProductActionRow";

const ProductListTable: FC<{
	data: TProduct[];
	isLoading: boolean;
}> = ({ data, isLoading }) => {
	const columns = getProductColumns();
	return (
		<DataTable
			columns={columns}
			data={data}
			searchKey="name"
			searchPlaceholder="Search by product name..."
			isLoading={isLoading}
			onBulkDelete={(_ids) => {
				// Implement bulk delete
			}}
		/>
	);
};

export default ProductListTable;

const getProductColumns = (): ColumnDef<TProduct>[] => {
	return [
		{
			accessorKey: "image",
			header: "Image",
			size: 100,
			cell: ({ row }) => (
				<img
					src={
						row.original.images?.[0]?.url ||
						"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"
					}
					alt={row.original.name}
					className="w-12 h-12"
				/>
			),
		},
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "price",
			header: "Price",
		},
		{
			accessorKey: "quantity",
			header: "Quantity",
		},
		{
			accessorKey: "category",
			header: "Category",
		},
		{
			accessorKey: "status",
			header: "Status",
		},
		{
			accessorKey: "actions",
			header: "Actions",
			cell: ({ row }) => <ProductActionRow id={row.original.id} />,
		},
	];
};
