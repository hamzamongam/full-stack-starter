"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
// Button import removed as used via div now
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface BaseSelectProps {
	value?: string | string[];
	onChange?: (value: any) => void;
	data: { value: string; label: string }[];
	mode?: "single" | "multiple";
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export function BaseSelect({
	value,
	onChange,
	data,
	mode = "single",
	placeholder = "Select option...",
	disabled,
	className,
}: BaseSelectProps) {
	const [open, setOpen] = React.useState(false);

	if (mode === "single") {
		return (
			<Select
				items={data}
				disabled={disabled}
				value={value as string}
				onValueChange={onChange}
			>
				<SelectTrigger className={cn(className, "bg-input h-10!")}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{data.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}

	// Multiple Select Implementation
	const selectedValues = Array.isArray(value) ? value : [];
	const handleSelect = (currentValue: string) => {
		const newValues = selectedValues.includes(currentValue)
			? selectedValues.filter((v) => v !== currentValue)
			: [...selectedValues, currentValue];
		onChange?.(newValues);
	};

	const handleRemove = (valueToRemove: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const newValues = selectedValues.filter((v) => v !== valueToRemove);
		onChange?.(newValues);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={<div />}
				nativeButton={false}
				role="combobox"
				aria-expanded={open}
				tabIndex={0}
				className={cn(
					"flex items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					"w-full justify-between h-auto min-h-10 hover:bg-background cursor-pointer",
					className,
					disabled && "pointer-events-none opacity-50",
				)}
				aria-disabled={disabled}
			>
				<div className="flex flex-1 items-center justify-between w-full">
					<div className="flex flex-wrap gap-1 items-center">
						{selectedValues.length > 0 ? (
							selectedValues.map((val) => {
								const label =
									data.find((item) => item.value === val)?.label || val;
								return (
									<Badge key={val} variant="secondary" className="mr-1">
										{label}
										<button
											className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer flex items-center justify-center p-0.5"
											onClick={(e) => {
												e.preventDefault();
												handleRemove(val, e);
											}}
											type="button"
										>
											<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
										</button>
									</Badge>
								);
							})
						) : (
							<span className="text-muted-foreground font-normal">
								{placeholder}
							</span>
						)}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={item.value}
									value={item.label}
									onSelect={() => handleSelect(item.value)}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedValues.includes(item.value)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
