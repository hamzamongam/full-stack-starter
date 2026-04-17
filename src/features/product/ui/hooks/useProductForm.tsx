import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import useBaseForm from "@/components/base/forms/useBaseForm";
import { useOrpcMutation } from "@/hooks/useOrpcMutation";
import { orpc } from "@/server/orpc/client";
import {
	CreateProductSchema,
	type TCreateProduct,
	type TProduct,
} from "../../domain/product.schema";

interface ProductListResponse {
	data: TProduct[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

interface ProductResponse {
	data: TProduct;
}

interface CreateProductContext {
	previousProducts: ProductListResponse | undefined;
	queryKey: readonly unknown[];
}

interface UpdateProductContext {
	previousProduct: ProductResponse | undefined;
	queryKey: readonly unknown[];
}

export type UseProductFormProps = {
	onSuccess?: () => void;
	product?: TProduct;
	productId?: string;
};

export type UseProductFormReturn = {
	form: UseFormReturn<TCreateProduct>;
	handleSubmit: SubmitHandler<TCreateProduct>;
	isPending: boolean;
};

const useProductForm = ({
	onSuccess,
	productId,
	product,
}: UseProductFormProps = {}): UseProductFormReturn => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate: createProduct, isPending: isCreating } = useOrpcMutation(
		orpc.product.create.mutationOptions({
			onMutate: async (newProduct) => {
				const queryKey = orpc.product.getAll.queryKey({
					input: { page: 1, limit: 12 },
				});
				await queryClient.cancelQueries({ queryKey });
				const previousProducts =
					queryClient.getQueryData<ProductListResponse>(queryKey);

				queryClient.setQueryData<ProductListResponse>(queryKey, (old) => {
					if (!old) return old;
					return {
						...old,
						data: [
							{
								...newProduct,
								id: `temp-id-${Math.random()}`,
								createdAt: new Date(),
								updatedAt: new Date(),
							} as any as TProduct,
							...(old.data || []),
						],
					};
				});

				return { previousProducts, queryKey } as CreateProductContext;
			},
			onSuccess: () => {
				onSuccess?.();
				navigate({ to: "/admin/products" });
			},
			onError: (_err, _newProduct, context) => {
				if (context?.previousProducts) {
					queryClient.setQueryData(context.queryKey, context.previousProducts);
				}
			},
			onSettled: (_data, _error, _variables, context) => {
				if (context?.queryKey) {
					queryClient.invalidateQueries({ queryKey: context.queryKey });
				}
			},
		}),
		{
			successMessage: "Product registered successfully!",
		},
	);

	const { mutate: updateProduct, isPending: isUpdating } = useOrpcMutation(
		orpc.product.update.mutationOptions({
			onMutate: async (updatedProduct) => {
				const queryKey = orpc.product.getById.queryKey({
					input: productId!,
				});
				await queryClient.cancelQueries({ queryKey });
				const previousProduct =
					queryClient.getQueryData<ProductResponse>(queryKey);

				queryClient.setQueryData<ProductResponse>(queryKey, (old) => {
					if (!old) return old;
					return {
						...old,
						data: {
							...old.data,
							...(updatedProduct as any),
						},
					};
				});

				return { previousProduct, queryKey } as UpdateProductContext;
			},
			onSuccess: ({ data }) => {
				onSuccess?.();
				if (productId) {
					// Ensure the cache is updated with the real data from server
					queryClient.setQueryData<ProductResponse>(
						orpc.product.getById.queryKey({ input: productId }),
						(old) => {
							if (!old) return old;
							return {
								...old,
								data: data as TProduct,
							};
						},
					);
				}
				navigate({ to: "/admin/products" });
			},
			onError: (_err, _updatedProduct, context) => {
				if (context?.previousProduct) {
					queryClient.setQueryData(context.queryKey, context.previousProduct);
				}
			},
			onSettled: () => {
				if (productId) {
					queryClient.invalidateQueries({
						queryKey: orpc.product.getById.queryKey({ input: productId }),
					});
				}
				queryClient.invalidateQueries({
					queryKey: orpc.product.getAll.queryKey({
						input: { page: 1, limit: 12 },
					}),
				});
			},
		}),
		{
			successMessage: "Product updated successfully!",
		},
	);

	// Transform product data to form values if available
	const defaultValues: TCreateProduct = product
		? {
				...product,
				categoryId: product.categoryId || "",
				name: product.name || "",
				description: product.description || "",
				shortDescription: product.shortDescription || "",
				price: product.price || 0,
				compareAtPrice: product.compareAtPrice || null,
				offerPrice: product.offerPrice || null,
				costPerItem: product.costPerItem || null,
				sku: product.sku || "",
				barcode: product.barcode || "",
				trackInventory: product.trackInventory ?? true,
				quantity: product.quantity || 0,
				status: (product.status as any) || "DRAFT", // Prisma string to Zod enum
				isFeatured: product.isFeatured ?? false,
				images: product.images || [],
				options: product.options || [],
				variants: product.variants || [],
			}
		: {
				name: "",
				description: "",
				shortDescription: "",
				price: 0,
				compareAtPrice: null,
				offerPrice: null,
				costPerItem: null,
				sku: "",
				barcode: "",
				trackInventory: true,
				quantity: 0,
				status: "DRAFT",
				isFeatured: false,
				categoryId: "",
				images: [],
				options: [],
				variants: [],
			};

	const [form] = useBaseForm({
		schema: CreateProductSchema,
		defaultValues,
	});

	// Reset form when product data loads
	useEffect(() => {
		if (product) {
			form.reset({
				...product,
				categoryId: product.categoryId || "",
				name: product.name || "",
				description: product.description || "",
				shortDescription: product.shortDescription || "",
				price: product.price || 0,
				compareAtPrice: product.compareAtPrice || null,
				offerPrice: product.offerPrice || null,
				costPerItem: product.costPerItem || null,
				sku: product.sku || "",
				barcode: product.barcode || "",
				trackInventory: product.trackInventory ?? true,
				quantity: product.quantity || 0,
				status: (product.status as any) || "DRAFT",
				isFeatured: product.isFeatured ?? false,
				images: product.images || [],
				options: product.options || [],
				variants: product.variants || [],
			});
		}
	}, [product, form]);

	const handleSubmit: SubmitHandler<TCreateProduct> = async (values) => {
		const payload = {
			...values,
		};

		if (productId) {
			updateProduct({ ...payload, id: productId });
		} else {
			createProduct(payload);
		}
	};

	return { form, handleSubmit, isPending: isCreating || isUpdating };
};

export default useProductForm;
