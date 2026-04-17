import React, { type FC, type PropsWithChildren } from "react";
import AppBreadcrumb from "./AppBreadcrumb";

interface AppPageInnerProps extends PropsWithChildren {
	title: string;
	subtitle?: string;
}

const AppPageInner: FC<AppPageInnerProps> = ({ children, title, subtitle }) => {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Page Header */}
			<div
				className="w-full min-h-[220px] md:min-h-[280px] bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center py-12"
				style={{
					backgroundImage: "url(/static/images/inner-header-bg.png)",
				}}
			>
				{/* Premium Dark Overlay */}
				<div className="absolute inset-0 bg-[#032F2D]/60 dark:bg-black/70" />

				<div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
					{/* Breadcrumbs */}
					<div className="mb-6">
						<AppBreadcrumb />
					</div>

					{/* Title with subtle animation entry effect if possible, but let's stick to clean CSS */}
					<h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
						{title}
					</h1>

					{subtitle && (
						<p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed drop-shadow-sm">
							{subtitle}
						</p>
					)}
				</div>
			</div>

			{/* Page Content */}
			<div className="flex-1 bg-background">
				<div className="container mx-auto px-4 py-12 md:py-16">{children}</div>
			</div>
		</div>
	);
};

export default AppPageInner;
