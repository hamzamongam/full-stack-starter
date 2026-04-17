import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { PageLayout } from "@/components/layouts/page-layout";
import { orpc } from "@/server/orpc/client";
import ProductListTable from "../components/ProductListTable";

const AdminProductListView: FC = () => {
	const { data, isLoading } = useQuery(
		orpc.product.getAll.queryOptions({
			input: {
				page: 1,
				limit: 10,
			},
		}),
	);

	return (
		<PageLayout
			isBack={false}
			title="Products"
			subtitle="View all products"
			actions={
				<BaseButton
					leftIcon={<Plus />}
					render={<Link to="/admin/products/add" />}
				>
					Add Product
				</BaseButton>
			}
		>
			<ProductListTable data={data?.data || []} isLoading={isLoading} />
		</PageLayout>
	);
};

export default AdminProductListView;
