import { isDefinedError } from "@orpc/client";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UseOrpcMutationOptions<TData, TError, TVariables, TContext>
	extends UseMutationOptions<TData, TError, TVariables, TContext> {
	successAlert?: boolean;
	errorAlert?: boolean;
	successMessage?: string;
	errorMessage?: string;
}

/**
 * A reusable hook wrapper for ORPC mutations with built-in toast notifications.
 *
 * @param mutationOptions - The mutation options usually provided by `orpc.some.procedure.mutationOptions()`
 * @param customOptions - Additional options for controlling toasts
 */
export function useOrpcMutation<TData, TError, TVariables, TContext>(
	mutationOptions: UseMutationOptions<TData, TError, TVariables, TContext>,
	customOptions: {
		successAlert?: boolean;
		errorAlert?: boolean;
		successMessage?: string;
		errorMessage?: string;
	} = {},
) {
	const {
		successAlert = true,
		errorAlert = true,
		successMessage = "Action completed successfully",
		errorMessage,
	} = customOptions;

	return useMutation({
		...mutationOptions,
		onSuccess: (...args) => {
			if (successAlert) {
				// Prioritize message from API response if it exists
				const apiMessage =
					args[0] && typeof args[0] === "object" && "message" in args[0]
						? (args[0].message as string)
						: undefined;

				toast.success(apiMessage || successMessage);
			}
			mutationOptions?.onSuccess?.(...args);
		},
		onError: (...args) => {
			if (errorAlert) {
				const error = args[0];
				console.log("error", error);
				if (isDefinedError(error)) {
					toast.error(errorMessage || error.message);
				} else {
					console.log("error", error);
					toast.error("Something went wrong (Unexpected error)");
				}
			}
			mutationOptions.onError?.(...args);
		},
	});
}
