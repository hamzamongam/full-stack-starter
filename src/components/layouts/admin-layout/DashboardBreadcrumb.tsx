import { Link, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DashboardBreadcrumb = () => {
	const matches = useMatches();
	const breadcrumbs = matches
		.filter((match) => match.staticData.breadcrumb)
		.map((match) => ({
			label: match.staticData.breadcrumb,
			href: match.pathname,
		}));

	return (
		<Breadcrumb className="hidden md:block">
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<Fragment key={crumb.href}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="font-bold text-foreground tracking-tight">
										{crumb.label}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										className="font-medium text-muted-foreground hover:text-primary transition-colors"
										render={(props) => (
											<Link {...props} to={crumb.href}>
												{crumb.label}
											</Link>
										)}
									/>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default DashboardBreadcrumb;
