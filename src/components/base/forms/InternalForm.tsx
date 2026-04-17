import type { ReactNode } from "react";
import {
	type FieldValues,
	FormProvider,
	type SubmitHandler,
	type UseFormReturn,
} from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";

type BaseFormProps<TFieldValues extends FieldValues = FieldValues> = {
	form: UseFormReturn<TFieldValues>;
	onSubmit?: SubmitHandler<TFieldValues>;
	children: ReactNode;
	className?: string;
};

const InternalForm = <TFieldValues extends FieldValues = FieldValues>({
	form,
	onSubmit,
	children,
	className,
}: BaseFormProps<TFieldValues>) => {
	// const form = useForm({
	//     resolver: zodResolver(schema),
	//     defaultValues: defaultValues
	// });
	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}>
				<FieldGroup className={className}>{children}</FieldGroup>
			</form>
		</FormProvider>
	);
};

export default InternalForm;
