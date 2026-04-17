import type * as React from "react";
import PhoneInput from "react-phone-number-input";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";

export interface BasePhoneInputProps {
	value?: string;
	onChange?: (value?: any) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	error?: boolean;
}

export const BasePhoneInput: React.FC<BasePhoneInputProps> = ({
	className,
	value,
	onChange,
	placeholder,
	disabled,
	error,
}) => {
	return (
		<PhoneInput
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				error && "border-destructive focus-within:ring-destructive",
				"[&_.PhoneInputCountry]:mr-2",
				"[&_.PhoneInputCountrySelect]:nav-auto",
				"[&_.PhoneInputCountrySelect]:bg-background [&_.PhoneInputCountrySelect]:text-foreground",
				"[&_.PhoneInputCountrySelect_option]:bg-background [&_.PhoneInputCountrySelect_option]:text-foreground",
				"[&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:placeholder:text-muted-foreground",
				className,
			)}
			value={value}
			onChange={(val) => onChange?.(val)}
			placeholder={placeholder}
			disabled={disabled}
			defaultCountry="IN"
		/>
	);
};
