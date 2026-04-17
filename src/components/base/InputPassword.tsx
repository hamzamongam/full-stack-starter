import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { BaseInput } from "@/components/base/input";
import { cn } from "@/lib/utils";

interface InputPasswordProps extends React.ComponentProps<typeof BaseInput> {
	ref?: React.Ref<HTMLInputElement>;
}

const InputPassword = ({ className, ref, ...props }: InputPasswordProps) => {
	const [show, setShow] = useState(false);

	return (
		<div className="relative w-full">
			<BaseInput
				{...props}
				ref={ref}
				type={show ? "text" : "password"}
				className={cn("pr-10", className)}
			/>
			<button
				type="button"
				onClick={() => setShow(!show)}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none transition-colors"
				tabIndex={-1}
			>
				{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</button>
		</div>
	);
};

export default InputPassword;
