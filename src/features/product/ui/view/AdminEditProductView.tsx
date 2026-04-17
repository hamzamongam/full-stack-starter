import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { PageLayout } from "@/components/layouts/page-layout";
import { orpc } from "@/server/orpc/client";
import { ProductForm } from "../components/ProductForm";
import useProductForm from "../hooks/useProductForm";

const AdminEditProductView: FC<{
	id: string;
}> = ({ id }) => {
	const { data: fetchResult, isLoading: isFetching } = useQuery(
		orpc.product.getById.queryOptions({
			input: id,
		}),
	);

	// Initialize form hook with our resolved data
	const { form, handleSubmit, isPending } = useProductForm({
		productId: id,
		product: fetchResult?.data as any, // Mapped automatically down the chain
		onSuccess: () => {},
	});

	if (isFetching) {
		return (
			<PageLayout title="Edit Product" subtitle="Loading component data...">
				<div className="flex h-64 items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
				</div>
			</PageLayout>
		);
	}

	if (!fetchResult?.data) {
		return (
			<PageLayout
				title="Product Not Found"
				subtitle="This product could not be loaded."
			>
				<p>Please check the URL or try searching from the dashboard.</p>
			</PageLayout>
		);
	}

	return (
		<PageLayout
			title={`Edit ${fetchResult.data.name}`}
			subtitle="Modify existing product details below."
			actions={
				<BaseButton
					type="submit"
					onClick={form.handleSubmit(handleSubmit)}
					isLoading={isPending}
					className="w-full sm:w-auto min-w-[150px]"
				>
					Save Changes
				</BaseButton>
			}
		>
			<ProductForm
				form={form}
				handleSubmit={handleSubmit}
				isPending={isPending}
				mode="edit"
			/>
		</PageLayout>
	);
};

export default AdminEditProductView;
