"use client";

import { useQuery } from "@tanstack/react-query";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import { BaseSelect } from "@/components/base/select";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/features/media/ui/components/MediaPicker";
import { orpc } from "@/server/orpc/client";
import type { UseProductFormReturn } from "../hooks/useProductForm";
import { ProductVariantsSection } from "./ProductVariantsSection";

type ProductFormProps = UseProductFormReturn & {
	mode?: "create" | "edit";
};

export function ProductForm({
	form,
	handleSubmit,
	isPending,
}: ProductFormProps) {
	const { data: categories } = useQuery(orpc.category.getAll.queryOptions({}));
	return (
		<BaseForm
			form={form}
			onSubmit={handleSubmit}
			className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500  px-1 pb-4"
		>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					{/* Basic Information */}
					<BaseForm.Card title="Basic Information">
						<BaseForm.Item
							control={form.control}
							name="name"
							label="Product Name"
						>
							<BaseInput
								className="bg-input"
								placeholder="e.g. Wireless Noise-Cancelling Headphones"
							/>
						</BaseForm.Item>
						<BaseForm.Item
							control={form.control}
							name="shortDescription"
							label="Short Description (Optional)"
						>
							<BaseInput placeholder="A brief summary for product cards..." />
						</BaseForm.Item>
						<BaseForm.Item
							control={form.control}
							name="description"
							label="Full Description"
						>
							<Textarea
								placeholder="Detailed product specifications and marketing copy..."
								className="min-h-[120px]"
							/>
						</BaseForm.Item>
					</BaseForm.Card>

					<BaseForm.Card title="Pricing">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<BaseForm.Item
								control={form.control}
								name="price"
								label="Regular Price ($)"
							>
								<BaseInput type="number" min="0" step="0.01" />
							</BaseForm.Item>
							<BaseForm.Item
								control={form.control}
								name="offerPrice"
								label="Offer Price ($) (Optional)"
							>
								<BaseInput
									type="number"
									min="0"
									step="0.01"
									placeholder="Discounted price"
								/>
							</BaseForm.Item>
							<BaseForm.Item
								control={form.control}
								name="compareAtPrice"
								label="Compare at Price ($) (Optional)"
							>
								<BaseInput
									type="number"
									min="0"
									step="0.01"
									placeholder="Original price crossed out"
								/>
							</BaseForm.Item>
							<BaseForm.Item
								control={form.control}
								name="costPerItem"
								label="Cost per Item ($) (Optional)"
							>
								<BaseInput
									type="number"
									min="0"
									step="0.01"
									placeholder="For profit calc"
								/>
							</BaseForm.Item>
						</div>
					</BaseForm.Card>

					<BaseForm.Card title="Inventory">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<BaseForm.Item
								control={form.control}
								name="sku"
								label="SKU (Stock Keeping Unit)"
							>
								<BaseInput placeholder="e.g. HD-WC-001" />
							</BaseForm.Item>
							<BaseForm.Item
								control={form.control}
								name="barcode"
								label="Barcode (ISBN, UPC, GTIN)"
							>
								<BaseInput placeholder="e.g. 0123456789012" />
							</BaseForm.Item>
							<BaseForm.Item
								control={form.control}
								name="quantity"
								label="Available Quantity"
							>
								<BaseInput type="number" min="0" />
							</BaseForm.Item>
							{/* Track Inventory boolean could go here as a Switch or Checkbox */}
						</div>
					</BaseForm.Card>

					<ProductVariantsSection />
				</div>

				{/* Sidebar Column */}
				<div className="space-y-6">
					<BaseForm.Card title="Image">
						<BaseForm.Item
							control={form.control}
							name="images"
							label="Product Images"
						>
							<MediaPicker
								type="product"
								multiple={true}
								disabled={isPending}
							/>
						</BaseForm.Item>
					</BaseForm.Card>
					<BaseForm.Card title="Organization">
						<BaseForm.Item
							control={form.control}
							name="status"
							label="Product Status"
						>
							<BaseSelect
								placeholder="Select status"
								data={[
									{ label: "Draft", value: "DRAFT" },
									{ label: "Active", value: "ACTIVE" },
									{ label: "Archived", value: "ARCHIVED" },
								]}
							/>
						</BaseForm.Item>

						<BaseForm.Item
							control={form.control}
							name="categoryId"
							label="Category"
						>
							<BaseSelect
								mode="single"
								placeholder="Select Category"
								data={
									categories?.data.map((v) => ({
										label: v.name,
										value: v.id,
									})) || []
								}
							/>
						</BaseForm.Item>
					</BaseForm.Card>
				</div>
			</div>
		</BaseForm>
	);
}
