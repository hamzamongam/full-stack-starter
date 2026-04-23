"use client";

import { getRouteApi } from "@tanstack/react-router";
import { PageLayout } from "@/components/layouts/page-layout";
import UserListTable from "../components/UserListTable";
import { useUserList } from "../hooks/useUserList";

const route = getRouteApi("/admin/users");

export default function UserView() {
	const { page, limit } = route.useSearch();
	const { data: users, isLoading } = useUserList({ page, limit });

	return (
		<PageLayout
			title="Users"
			subtitle="Manage platform users and their roles"
		>
			<UserListTable
				data={users?.data || []}
				isLoading={isLoading}
				total={users?.meta?.total}
				page={page}
				limit={limit}
			/>
		</PageLayout>
	);
}
