import * as React from "react";
import { cn } from "@/lib/utils";

const BaseRadio = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
	return (
		<input
			type="radio"
			ref={ref}
			className={cn(
				"aspect-square h-4 w-4 border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
});
BaseRadio.displayName = "BaseRadio";

export { BaseRadio };
