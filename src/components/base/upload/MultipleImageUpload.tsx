"use client";

import { Loader2, UploadCloud, X } from "lucide-react";
import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MultipleImageUploadProps {
	value?: (string | File)[];
	onChange?: (value: (string | File)[]) => void;
	className?: string;
	disabled?: boolean;
}

export const MultipleImageUpload: FC<MultipleImageUploadProps> = ({
	value = [],
	onChange,
	className,
	disabled,
}) => {
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// URLs for previewing File objects
	const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});

	useEffect(() => {
		const newPreviewUrls: Record<number, string> = {};
		value.forEach((item, index) => {
			if (item instanceof File) {
				// Only create a URL if we don't already have one for this specific File instance
				// A more robust way would be to track files by reference, but index is okay if order is stable
				newPreviewUrls[index] = URL.createObjectURL(item);
			}
		});

		setPreviewUrls(newPreviewUrls);

		// Cleanup
		return () => {
			Object.values(newPreviewUrls).forEach((url) => {
				URL.revokeObjectURL(url);
			});
		};
	}, [value]);

	const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		// Validation
		const validFiles = files.filter((file) => file.type.startsWith("image/"));
		if (validFiles.length !== files.length) {
			setError("Only image files are allowed.");
			return;
		}

		const sizeValidFiles = validFiles.filter(
			(file) => file.size <= 5 * 1024 * 1024,
		);
		if (sizeValidFiles.length !== validFiles.length) {
			setError("Some files exceed the 5MB limit.");
			return;
		}

		setError(null);
		onChange?.([...value, ...sizeValidFiles]);

		if (inputRef.current) inputRef.current.value = "";
	};

	const handleRemove = (indexToRemove: number) => {
		const newArray = value.filter((_, index) => index !== indexToRemove);
		onChange?.(newArray);
		setError(null);
	};

	return (
		<div className={cn("space-y-4", className)}>
			{/* Upload Dropzone */}
			<button
				type="button"
				onClick={() => !disabled && inputRef.current?.click()}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						!disabled && inputRef.current?.click();
					}
				}}
				className={cn(
					"flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-input py-10 transition-colors hover:bg-muted/80 cursor-pointer",
					disabled && "opacity-50 cursor-not-allowed hover:bg-muted/50",
					error && "border-destructive/50 bg-destructive/5",
				)}
			>
				<div className="flex flex-col items-center gap-2 text-center p-3">
					<UploadCloud className="size-8 text-muted-foreground" />
					<div className="text-sm font-medium text-muted-foreground">
						Click to upload multiple images
					</div>
					<div className="text-xs text-muted-foreground/60">
						SVG, PNG, JPG or GIF (max. 5MB per file)
					</div>
				</div>
				<input
					ref={inputRef}
					type="file"
					multiple
					className="hidden"
					accept="image/*"
					onChange={handleFileSelect}
					disabled={disabled}
				/>
			</button>

			{error && <p className="text-xs font-medium text-destructive">{error}</p>}

			{/* Previews */}
			{value.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
					{value.map((item, index) => {
						const imgSrc = typeof item === "string" ? item : previewUrls[index];
						const uniqueKey =
							typeof item === "string" ? item : item.name + index;

						return (
							<div
								key={uniqueKey}
								className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted shadow-sm group"
							>
								{imgSrc ? (
									<img
										src={imgSrc}
										alt={`Media preview ${index + 1}`}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<Loader2 className="size-4 animate-spin text-muted-foreground" />
									</div>
								)}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleRemove(index);
									}}
									disabled={disabled}
									className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-all opacity-0 group-hover:opacity-100 hover:bg-destructive/90 hover:scale-105"
								>
									<X className="size-3" />
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
