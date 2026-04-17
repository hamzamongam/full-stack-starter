import * as React from "react";
import { BaseInput } from "./BaseInput";

interface BaseInputNumberProps
	extends Omit<React.ComponentProps<typeof BaseInput>, "onChange" | "type"> {
	onChange?: (value: number | undefined) => void;
	value?: number | undefined;
}

const BaseInputNumber = React.forwardRef<
	HTMLInputElement,
	BaseInputNumberProps
>(({ onChange, value, ...props }, ref) => {
	const [inputValue, setInputValue] = React.useState<string>(
		value?.toString() ?? "",
	);

	React.useEffect(() => {
		setInputValue(value?.toString() ?? "");
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;

		// Allow empty string to clear the input
		if (val === "") {
			setInputValue("");
			onChange?.(undefined);
			return;
		}

		// Only allow valid numbers
		const numberVal = parseFloat(val);
		if (!Number.isNaN(numberVal)) {
			setInputValue(val);
			onChange?.(numberVal);
		}
	};

	return (
		<BaseInput
			{...props}
			ref={ref}
			type="number"
			value={inputValue}
			onChange={handleChange}
		/>
	);
});

BaseInputNumber.displayName = "BaseInputNumber";

export { BaseInputNumber };
