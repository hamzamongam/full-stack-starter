import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AppBreadcrumb = () => {
	const matches = useMatches();

	// Filter matches and generate breadcrumbs
	// We'll use the last part of the pathname as label if breadcrumb is missing in staticData
	const breadcrumbs = matches
		.filter((match) => match.pathname !== "/")
		.map((match) => {
			const staticData = match.staticData as { breadcrumb?: string };
			const label =
				staticData?.breadcrumb ||
				match.pathname.split("/").pop()?.replace(/-/g, " ") ||
				"Home";
			return {
				label: label.charAt(0).toUpperCase() + label.slice(1),
				href: match.pathname,
			};
		});

	// Always add Home at the beginning if not present
	if (breadcrumbs.length === 0 || breadcrumbs[0].href !== "/") {
		breadcrumbs.unshift({ label: "Home", href: "/" });
	}

	return (
		<Breadcrumb className="text-white/80">
			<BreadcrumbList className="text-white/70 gap-1 sm:gap-2">
				{breadcrumbs.map((crumb, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<Fragment key={crumb.href}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="font-semibold text-white tracking-tight capitalize">
										{crumb.label}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										className="font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1"
										render={(props) => (
											<Link {...props} to={crumb.href}>
												{index === 0 ? <Home className="w-3.5 h-3.5" /> : null}
												<span>{crumb.label}</span>
											</Link>
										)}
									/>
								)}
							</BreadcrumbItem>
							{!isLast && (
								<BreadcrumbSeparator className="text-white/40">
									<ChevronRight className="w-3.5 h-3.5" />
								</BreadcrumbSeparator>
							)}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default AppBreadcrumb;
