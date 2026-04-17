"use client";

import { UploadCloud, X } from "lucide-react";
import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BaseImageUploadProps {
	value?: string | File | null;
	manualUpload?: boolean;
	onChange?: (value: string | File | null) => void;
	className?: string;
	disabled?: boolean;
}

export const BaseImageUpload: FC<BaseImageUploadProps> = ({
	value,
	onChange,
	className,
	disabled,
}) => {
	const [imageUrl, setImageUrl] = useState<string | null>(
		typeof value === "string" ? value : null,
	);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validation
		if (!file.type.startsWith("image/")) {
			setError("Only image files are allowed.");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			setError("File size must be less than 5MB.");
			return;
		}

		setError(null);

		const objectUrl = URL.createObjectURL(file);
		setImageUrl(objectUrl);
		onChange?.(file);
		console.log(file);
		// clear input
		// if (inputRef.current) inputRef.current.value = "";
		// return;
	};

	const handleRemove = () => {
		onChange?.(null);
		setError(null);
		setImageUrl(null);
	};

	useEffect(() => {
		if (value) {
			if (typeof value === "string") {
				setImageUrl(value);
			} else if (value instanceof File) {
				const url = URL.createObjectURL(value);
				setImageUrl(url);
				return () => URL.revokeObjectURL(url);
			}
		}
	}, [value]);

	return (
		<div className={cn("space-y-2", className)}>
			{imageUrl ? (
				<div className="relative inline-block">
					<div className="relative size-52 overflow-hidden rounded-xl border border-border shadow-sm">
						<img
							src={imageUrl}
							alt="Preview"
							className="h-full w-full object-cover"
						/>
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={disabled}
						className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
					>
						<X className="size-3" />
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={() => !disabled && inputRef.current?.click()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							!disabled && inputRef.current?.click();
						}
					}}
					className={cn(
						"flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 py-10 transition-colors hover:bg-muted/80 cursor-pointer",
						disabled && "opacity-50 cursor-not-allowed hover:bg-muted/50",
						error && "border-destructive/50 bg-destructive/5",
					)}
				>
					<div className="flex flex-col items-center gap-2 text-center p-3">
						<UploadCloud className="size-8 text-muted-foreground" />
						<div className="text-sm font-medium text-muted-foreground">
							Click to upload image
						</div>
						<div className="text-xs text-muted-foreground/60">
							SVG, PNG, JPG or GIF (max. 5MB)
						</div>
					</div>
					<input
						ref={inputRef}
						type="file"
						className="hidden"
						accept="image/*"
						onChange={handleFileSelect}
						disabled={disabled}
					/>
				</button>
			)}
			{error && <p className="text-xs font-medium text-destructive">{error}</p>}
		</div>
	);
};
