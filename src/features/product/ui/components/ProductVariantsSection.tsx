import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BaseButton } from "@/components/base/button/BaseButton";
import BaseForm from "@/components/base/forms";
import { BaseInput } from "@/components/base/input";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { MediaPicker } from "@/features/media/ui/components/MediaPicker";
import type { TCreateProduct } from "../../domain/product.schema";

export function ProductVariantsSection() {
	const { control, getValues } = useFormContext<TCreateProduct>();

	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption,
	} = useFieldArray({
		control,
		name: "options",
	});

	const { fields: variantFields, replace: replaceVariants } = useFieldArray({
		control,
		name: "variants",
	});

	const generateVariants = () => {
		const options = getValues("options") || [];
		if (options.length === 0) {
			replaceVariants([]);
			return;
		}

		// Cartesian product of option values
		// e.g. [[S, M], [Red, Blue]] -> [[S, Red], [S, Blue], [M, Red], [M, Blue]]
		const cartesianProduct = (arr: any[][]): any[][] => {
			return arr.reduce(
				(a, b) =>
					a
						.map((x) => b.map((y) => x.concat(y)))
						.reduce((a, b) => a.concat(b), []),
				[[]] as any[][],
			);
		};

		const validOptions = options.filter(
			(opt) => opt.name && opt.values && opt.values.length > 0,
		);

		if (validOptions.length === 0) {
			replaceVariants([]);
			return;
		}

		const optionValuesArray = validOptions.map((opt) =>
			opt.values.map((v) => ({ optionName: opt.name, value: v.value })),
		);

		const combinations = cartesianProduct(optionValuesArray);
		const basePrice = getValues("price") || 0;

		const newVariants = combinations.map((combo) => {
			const title = combo.map((c: any) => c.value).join(" / ");
			const optionsRecord = combo.reduce((acc: any, curr: any) => {
				acc[curr.optionName] = curr.value;
				return acc;
			}, {});

			return {
				title,
				price: basePrice, // Default to base price
				compareAtPrice: null,
				costPerItem: null,
				sku: "",
				barcode: "",
				images: [],
				trackInventory: true,
				quantity: 0,
				options: optionsRecord,
			};
		});

		replaceVariants(newVariants);
	};

	return (
		<div className="space-y-6">
			<BaseForm.Card title="Options">
				<div className="space-y-4">
					{optionFields.map((field, index) => (
						<div
							key={field.id}
							className="p-4 border rounded-md relative space-y-4"
						>
							<div className="absolute top-2 right-2">
								<BaseButton
									type="button"
									variant="ghost"
									className="size-8 p-0"
									onClick={() => removeOption(index)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</BaseButton>
							</div>

							<BaseForm.Item
								control={control}
								name={`options.${index}.name`}
								label="Option Name"
							>
								<BaseInput {...field} placeholder="e.g. Size, Color" />
							</BaseForm.Item>

							<FormField
								control={control}
								name={`options.${index}.values`}
								render={({ field: valuesField }) => {
									const valuesStr =
										valuesField.value?.map((v: any) => v.value).join(", ") ||
										"";

									return (
										<FormItem>
											<FormLabel>Option Values (comma separated)</FormLabel>
											<FormControl>
												<BaseInput
													placeholder="e.g. Small, Medium, Large"
													defaultValue={valuesStr}
													onChange={(e) => {
														const rawValue = e.target.value;
														const newValues = rawValue
															.split(",")
															.map((v, i) => ({
																value: v.trim(),
																position: i,
															}))
															.filter((v) => v.value !== "");
														valuesField.onChange(newValues);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>
					))}

					<BaseButton
						type="button"
						variant="primaryOutline"
						className="w-full"
						leftIcon={<Plus className="h-4 w-4 mr-2" />}
						onClick={() =>
							appendOption({
								name: "",
								position: optionFields.length,
								values: [],
							})
						}
					>
						Add Option
					</BaseButton>

					{optionFields.length > 0 && (
						<BaseButton type="button" onClick={generateVariants}>
							Generate Variants
						</BaseButton>
					)}
				</div>
			</BaseForm.Card>

			{variantFields.length > 0 && (
				<BaseForm.Card title="Variants">
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left border-collapse">
							<thead className="bg-muted">
								<tr>
									<th className="p-3 border-b">Variant</th>
									<th className="p-3 border-b">Price</th>
									<th className="p-3 border-b">Quantity</th>
									<th className="p-3 border-b">SKU</th>
									<th className="p-3 border-b min-w-[200px]">Images</th>
								</tr>
							</thead>
							<tbody>
								{variantFields.map((field: any, index) => (
									<tr
										key={field.id}
										className="border-b last:border-0 hover:bg-muted/50"
									>
										<td className="p-3 font-medium">{field.title}</td>
										<td className="p-3 align-top">
											<FormField
												control={control}
												name={`variants.${index}.price`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<BaseInput
																type="number"
																min="0"
																step="0.01"
																{...field}
																onChange={(e) =>
																	field.onChange(e.target.valueAsNumber)
																}
																className="w-24 mt-2"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</td>
										<td className="p-3 align-top">
											<FormField
												control={control}
												name={`variants.${index}.quantity`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<BaseInput
																type="number"
																min="0"
																{...field}
																onChange={(e) =>
																	field.onChange(e.target.valueAsNumber)
																}
																className="w-24 mt-2"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</td>
										<td className="p-3 align-top">
											<FormField
												control={control}
												name={`variants.${index}.sku`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<BaseInput
																{...field}
																value={field.value || ""}
																className="w-32 mt-2"
																placeholder="SKU"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</td>
										<td className="p-3 align-top">
											<FormField
												control={control}
												name={`variants.${index}.media`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div className="w-[200px] mt-2 scale-75 origin-top-left">
																<MediaPicker
																	multiple={true}
																	value={field.value}
																	onChange={(items) => {
																		field.onChange(items);
																	}}
																/>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</BaseForm.Card>
			)}
		</div>
	);
}
