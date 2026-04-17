"use client";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = Omit<ButtonProps, "variant" | "size"> &
	VariantProps<typeof buttonVariants> & {
		isLoading?: boolean;
		loadingText?: string;
		leftIcon?: React.ReactNode;
		rightIcon?: React.ReactNode;
		size?: "default" | "sm" | "lg";
	};

const buttonVariants = cva("relative gap-2 h-12 flex cursor-pointer", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground text-white",
			primaryOutline:
				"border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
			ghost: "",
			link: "",
		},
		size: {
			default: "",
			sm: "h-10",
			lg: "h-14",
		},
	},
});

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
	(
		{
			children,
			isLoading,
			loadingText,
			leftIcon,
			rightIcon,
			disabled,
			className,
			variant,
			size,
			...props
		},
		ref,
	) => {
		return (
			<Button
				ref={ref}
				disabled={isLoading || disabled}
				className={cn(buttonVariants({ variant, size, className }))}
				variant={
					variant === "primary" || variant === "primaryOutline"
						? undefined
						: (variant as ButtonProps["variant"])
				}
				size={
					size === "default" || size === "sm" || size === "lg"
						? undefined
						: (size as ButtonProps["size"])
				}
				{...props}
			>
				{isLoading && (
					<Loader2
						className="size-4 animate-spin shrink-0"
						aria-hidden="true"
					/>
				)}
				{!isLoading && leftIcon && (
					<span className="shrink-0 transition-transform group-hover/button:scale-110">
						{leftIcon}
					</span>
				)}
				<span className="truncate">
					{isLoading && loadingText ? loadingText : children}
				</span>
				{!isLoading && rightIcon && (
					<span className="shrink-0 transition-transform group-hover/button:scale-110">
						{rightIcon}
					</span>
				)}
			</Button>
		);
	},
);
BaseButton.displayName = "BaseButton";
