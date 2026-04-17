import type { FC } from "react";
import { BaseButton } from "@/components/base/button";
import { PageLayout } from "@/components/layouts/page-layout";
import { ProductForm } from "../components/ProductForm";
import useProductForm from "../hooks/useProductForm";

const AdminAddProductView: FC = () => {
	const { form, handleSubmit, isPending } = useProductForm();
	return (
		<PageLayout
			title="Add New Product"
			subtitle="Create a new product listing in your catalog. Make sure to fill out all the necessary fields for display."
			actions={
				<BaseButton
					type="submit"
					onClick={form.handleSubmit(handleSubmit)}
					isLoading={isPending}
					className="w-full sm:w-auto min-w-[150px]"
				>
					Create Product
				</BaseButton>
			}
		>
			<ProductForm
				form={form}
				handleSubmit={handleSubmit}
				isPending={isPending}
				mode="create"
			/>
		</PageLayout>
	);
};

export default AdminAddProductView;
