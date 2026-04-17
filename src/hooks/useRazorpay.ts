import { useCallback } from "react";
import { useRazorpay as useReactRazorpay } from "react-razorpay";
import type { RazorpayOrderOptions } from "react-razorpay";

export function useRazorpay() {
	const { error, isLoading, Razorpay } = useReactRazorpay();

	const initializePayment = useCallback(
		(options: RazorpayOrderOptions) => {
			if (!Razorpay) {
				console.error("Razorpay SDK is not loaded yet.");
				return;
			}

			try {
				const rzp = new Razorpay(options);
				rzp.on("payment.failed", (response) => {
					console.error("Payment failed", response.error);
				});
				rzp.open();
			} catch (err) {
				console.error("Failed to initialize Razorpay:", err);
			}
		},
		[Razorpay],
	);

	return {
		isScriptLoaded: !isLoading && !error && !!Razorpay,
		initializePayment,
	};
}

export type { RazorpayOrderOptions as RazorpayOptions };
