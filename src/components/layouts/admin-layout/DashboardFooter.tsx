import type { FC } from "react";

const DashboardFooter: FC = () => {
	return (
		<footer className="p-6 text-center text-xs text-muted-foreground/60 border-t border-border/50 bg-background/20">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
				<p className="text-label-caps text-muted-foreground/40 leading-relaxed">
					© 2026 SEAGLE E-Commerce Admin Suite. All rights reserved.
				</p>
				<div className="flex items-center gap-6">
					<a
						href="https://github.com/"
						className="hover:text-primary transition-colors"
						type="button"
					>
						Documentation
					</a>
					<a
						href="/"
						className="hover:text-primary transition-colors"
						type="button"
					>
						Support
					</a>
					<a
						href="#/"
						className="hover:text-primary transition-colors"
						type="button"
					>
						Privacy Policy
					</a>
				</div>
			</div>
		</footer>
	);
};

export default DashboardFooter;
