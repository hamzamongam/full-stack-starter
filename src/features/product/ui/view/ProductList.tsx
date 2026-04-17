"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { confirm } from "@/components/base/dialog/confirm";
import { BaseButton } from "@/components/base/button/BaseButton";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { orpc } from "@/server/orpc/client";
import { ProductForm } from "../components/ProductForm";
import useProductForm from "../hooks/useProductForm";

export default function ProductList() {
	// @ts-expect-error - orpc type inference issue
	const { data: products, refetch } = orpc.product.getAll.useQuery({});
	// @ts-expect-error - orpc type inference issue
	const { data: categories } = orpc.category.getAll.useQuery({}); // To show category names if needed, though product likely has categoryId.
	// Ideally product.getAll should return category relation or we fetch it.
	// For now, simpler list.

	// @ts-expect-error - orpc type inference issue
	const deleteProduct = orpc.product.delete.useMutation({
		onSuccess: () => {
			toast.success("Product deleted");
			refetch();
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const [isOpen, setIsOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<any>(null);

	const {
		form,
		handleSubmit,
		isPending: isFormPending,
	} = useProductForm({
		productId: editingProduct?.id ? String(editingProduct.id) : undefined,
		product: editingProduct || undefined,
		onSuccess: () => {
			setIsOpen(false);
			setEditingProduct(null);
			refetch();
		},
	});

	const getCategoryName = (id: number) => {
		return categories?.find((c: any) => c.id === id)?.name || "Unknown";
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Products</h1>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<BaseButton
						onClick={() => {
							setEditingProduct(null);
							setIsOpen(true);
						}}
					>
						Add Product
					</BaseButton>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editingProduct ? "Edit Product" : "Add New Product"}
							</DialogTitle>
						</DialogHeader>
						<ProductForm
							form={form}
							handleSubmit={handleSubmit}
							isPending={isFormPending}
							mode={editingProduct ? "edit" : "create"}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Edit Dialog */}
			<Dialog
				open={!!editingProduct}
				onOpenChange={(open) => !open && setEditingProduct(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Product</DialogTitle>
					</DialogHeader>
					<ProductForm
						form={form}
						handleSubmit={handleSubmit}
						isPending={isFormPending}
						mode="edit"
					/>
				</DialogContent>
			</Dialog>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{products?.map((product: any) => (
					<div
						key={product.id}
						className="border rounded-lg shadow-sm p-4 flex flex-col gap-2"
					>
						<div className="flex justify-between items-start gap-4">
							<div className="flex-1">
								<h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
								<div className="flex items-center gap-2 mt-1">
									<span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5 whitespace-nowrap">
										{getCategoryName(product.categoryId)}
									</span>
									<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
										product.status === "ACTIVE" ? "bg-green-100 text-green-700" :
										product.status === "ARCHIVED" ? "bg-gray-100 text-gray-700" :
										"bg-amber-100 text-amber-700"
									}`}>
										{product.status || "DRAFT"}
									</span>
								</div>
							</div>
						</div>
						<p className="text-sm text-gray-500 line-clamp-2">
							{product.description}
						</p>
						<div className="text-xl font-bold mt-2">
							${product.price.toFixed(2)}
						</div>

						<div className="flex gap-2 mt-4 pt-4 border-t">
							<BaseButton
								variant="primaryOutline"
								className="size-8 p-0 border-input"
								onClick={() => setEditingProduct(product)}
							>
								<Edit className="w-4 h-4" />
							</BaseButton>
							<BaseButton
								variant="primaryOutline"
								className="size-8 p-0 border-input"
								onClick={() => {
									confirm({
										title: "Delete Product",
										description:
											"Are you sure you want to delete this product? This action cannot be undone.",
										confirmText: "Delete",
										variant: "destructive",
										onConfirm: async () => {
											deleteProduct.mutate(product.id);
										},
									});
								}}
								isLoading={deleteProduct.isPending}
							>
								<Trash2 className="w-4 h-4" />
							</BaseButton>
						</div>
					</div>
				))}
				{products?.length === 0 && (
					<div className="col-span-full text-center text-gray-500">
						No products found.
					</div>
				)}
			</div>
		</div>
	);
}
