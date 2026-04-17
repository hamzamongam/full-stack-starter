"use client";

import { X } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TMediaInput, TMediaType } from "../../domain/media.schema";
import { MediaGalleryDialog } from "./MediaGalleryDialog";

interface MediaPickerProps {
	type?: TMediaType;
	value?: TMediaInput[];
	onChange?: (value: TMediaInput[]) => void;
	className?: string;
	disabled?: boolean;
	multiple?: boolean;
}

export const MediaPicker: FC<MediaPickerProps> = ({
	type,
	value = [],
	onChange,
	className,
	disabled,
	multiple = true,
}) => {
	const handleRemove = (indexToRemove: number) => {
		const newArray = (value || []).filter(
			(_, index) => index !== indexToRemove,
		);
		onChange?.(newArray);
	};

	const handleInsert = (items: TMediaInput[]) => {
		if (multiple) {
			onChange?.(items);
		} else {
			onChange?.(items.length > 0 ? [items[0]] : []);
		}
	};

	return (
		<div className={cn("space-y-4", className)}>
			<MediaGalleryDialog
				type={type}
				multiple={multiple}
				onInsert={handleInsert}
				value={value}
			>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					className="w-full h-32 border-2 border-dashed border-muted-foreground/25 hover:bg-muted/80"
				>
					<div className="flex flex-col items-center gap-2 text-center p-3">
						<span className="text-sm font-medium text-muted-foreground">
							Click to select or upload media
						</span>
						<span className="text-xs text-muted-foreground/60">
							Browse Media Library
						</span>
					</div>
				</Button>
			</MediaGalleryDialog>

			{/* Previews */}
			{(value || []).length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
					{(value || []).map((media, index) => (
						<div
							key={`${media?.id ?? "M"}-${index}`}
							className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted shadow-sm group"
						>
							<img
								src={media.url}
								alt={`Media ${index + 1}`}
								className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
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
					))}
				</div>
			)}
		</div>
	);
};

export const SingleMediaPicker: FC<{
	type?: TMediaType;
	value?: TMediaInput | null;
	onChange?: (value: TMediaInput | null) => void;
	disabled?: boolean;
}> = ({ type, value, onChange, disabled }) => {
	const items = value ? [value] : [];
	const handleItemsChange = (newItems: TMediaInput[]) => {
		onChange?.(newItems.length > 0 ? newItems[0] : null);
	};

	return (
		<MediaPicker
			type={type}
			multiple={false}
			value={items}
			onChange={handleItemsChange}
			disabled={disabled}
		/>
	);
};
