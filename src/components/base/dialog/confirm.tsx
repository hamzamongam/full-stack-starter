import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "@/components/base/dialog/ConfirmDialog";

type ConfirmOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
	onConfirm?: () => Promise<void> | void;
};

export const confirm = (options: ConfirmOptions = {}): void => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);

	const handleClose = () => {
		root.unmount();
		container.remove();
	};

	const Component = () => {
		const [isLoading, setIsLoading] = useState(false);

		const onConfirmClick = async () => {
			if (options.onConfirm) {
				setIsLoading(true);
				try {
					await options.onConfirm();
				} finally {
					setIsLoading(false);
					handleClose();
				}
			} else {
				handleClose();
			}
		};

		return (
			<ConfirmDialog
				open={true}
				onOpenChange={(open) => {
					if (!open) handleClose();
				}}
				title={options.title || "Confirm Action"}
				description={options.description}
				confirmText={options.confirmText || "Confirm"}
				cancelText={options.cancelText || "Cancel"}
				variant={options.variant}
				onConfirm={onConfirmClick}
				isLoading={isLoading}
			/>
		);
	};

	root.render(<Component />);
};
