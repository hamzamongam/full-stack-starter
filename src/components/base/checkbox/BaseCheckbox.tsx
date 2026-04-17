import type * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const BaseCheckbox = ({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive>) => {
	return (
		<CheckboxPrimitive
			className={cn(
				// Add any custom default styles here if needed, or keep it generic wrapper
				className,
			)}
			{...props}
		/>
	);
};

export { BaseCheckbox };
