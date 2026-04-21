"use client";

import { getRouteApi } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import TaskListTable from "../components/TaskListTable";
import { useTaskList } from "../hooks/useTaskList";

const AddTaskModal = lazy(() => import("../components/AddTaskModal"));
const route = getRouteApi("/admin/tasks");

export default function TaskView() {
	const { page, limit } = route.useSearch();
	const { data: tasks, isLoading } = useTaskList({ page, limit });

	return (
		<PageLayout
			title="Tasks"
			subtitle="View and manage all tasks"
			actions={
				<Suspense fallback={null}>
					<AddTaskModal />
				</Suspense>
			}
		>
			<TaskListTable
				data={tasks?.data || []}
				isLoading={isLoading}
				total={tasks?.meta?.total}
				page={page}
				limit={limit}
			/>
		</PageLayout>
	);
}
