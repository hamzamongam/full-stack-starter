import { zodResolver } from "@hookform/resolvers/zod";
import {
	type DefaultValues,
	type FieldValues,
	type UseFormReturn,
	useForm,
} from "react-hook-form";
import type { ZodType, z } from "zod";

// biome-ignore lint/suspicious/noExplicitAny: generic wrapper needs any for Zod definitions
type useBaseFormProps<T extends ZodType<any, any>> = {
	defaultValues?: DefaultValues<z.infer<T>>;
	schema?: T;
};

export type TForm<T extends FieldValues> = UseFormReturn<T>;

// biome-ignore lint/suspicious/noExplicitAny: library generics
type useBaseFormReturn<T extends ZodType<any, any>> = [
	UseFormReturn<z.infer<T>, any, any>,
	op: { validateFields: () => Promise<z.infer<T>> },
];

// biome-ignore lint/suspicious/noExplicitAny: generic form hook
const useBaseForm = <T extends ZodType<any, any>>({
	defaultValues,
	schema,
}: useBaseFormProps<T>): useBaseFormReturn<T> => {
	const form = useForm<z.infer<T>>({
		defaultValues,
		mode: "all",
		// biome-ignore lint/suspicious/noExplicitAny: library type cast
		resolver: schema ? (zodResolver(schema) as any) : undefined,
	});

	const validateFields = (): Promise<z.infer<T>> => {
		return new Promise((resolve, reject) => {
			form.handleSubmit(
				(val) => {
					resolve(val as z.infer<T>);
				},
				(error) => reject(error),
			)();
		});
	};

	return [form, { validateFields }];
};

export default useBaseForm;
