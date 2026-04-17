import * as React from "react";
import { Input as InputPrimitive } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BaseInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
	return (
		<InputPrimitive
			ref={ref}
			className={cn(
				"h-10 px-4 rounded-xl border-border bg-input focus:border-primary focus:ring-primary/20",
				className,
			)}
			{...props}
		/>
	);
});
BaseInput.displayName = "BaseInput";

export { BaseInput };
