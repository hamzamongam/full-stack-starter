"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { BaseButton } from "@/components/base/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface BaseDatePickerProps {
	value?: Date;
	onChange?: (date?: Date) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	error?: boolean;
}

export function BaseDatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	disabled,
	className,
	error,
}: BaseDatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<BaseButton
						variant={"primaryOutline"}
						className={cn(
							"w-full justify-start text-left font-normal border-input shadow-sm h-10 px-3 py-2",
							!value && "text-muted-foreground",
							error && "border-destructive focus-visible:ring-destructive",
							disabled && "cursor-not-allowed opacity-50",
							className,
						)}
						disabled={disabled}
						leftIcon={<CalendarIcon className="h-4 w-4" />}
					>
						{value ? format(value, "PPP") : <span>{placeholder}</span>}
					</BaseButton>
				}
			/>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={onChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
