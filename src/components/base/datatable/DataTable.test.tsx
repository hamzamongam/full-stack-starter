// @vitest-environment jsdom

import type { ColumnDef } from "@tanstack/react-table";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./DataTable";

interface TestData {
	id: string;
	name: string;
	role: string;
}

const columns: ColumnDef<TestData>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "role",
		header: "Role",
	},
];

const data: TestData[] = [
	{ id: "1", name: "Alice", role: "Admin" },
	{ id: "2", name: "Bob", role: "User" },
	{ id: "3", name: "Charlie", role: "User" },
	{ id: "4", name: "David", role: "User" },
	{ id: "5", name: "Eve", role: "Admin" },
	{ id: "6", name: "Frank", role: "User" },
	{ id: "7", name: "Grace", role: "User" },
	{ id: "8", name: "Heidi", role: "Admin" },
	{ id: "9", name: "Ivan", role: "User" },
	{ id: "10", name: "Judy", role: "User" },
	{ id: "11", name: "Mallory", role: "Attacker" }, // 11th item for pagination
];

describe("DataTable", () => {
	it("renders data correctly", () => {
		render(<DataTable columns={columns} data={data.slice(0, 2)} />);
		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Bob")).toBeInTheDocument();
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Role")).toBeInTheDocument();
	});

	it("renders empty state", () => {
		render(<DataTable columns={columns} data={[]} />);
		expect(screen.getByText("No results found.")).toBeInTheDocument();
	});

	it("renders loading skeleton when isLoading is true", () => {
		const { container } = render(
			<DataTable columns={columns} data={[]} isLoading />,
		);
		expect(screen.queryByText("No results found.")).not.toBeInTheDocument();
	});

	it("filters data by search key", async () => {
		render(<DataTable columns={columns} data={data} searchKey="name" />);

		const input = screen.getByPlaceholderText("Search...");
		await userEvent.type(input, "Alice");

		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.queryByText("Bob")).not.toBeInTheDocument();
	});

	it("handles pagination", async () => {
		render(<DataTable columns={columns} data={data} />);

		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.queryByText("Mallory")).not.toBeInTheDocument();

		// Use aria-label implicit in chevrons or just button index
		// The component has "Go to next page" screen reader text (sr-only) inside button
		const nextBtn = screen.getByRole("button", { name: "Go to next page" });
		await userEvent.click(nextBtn);

		expect(screen.getByText("Mallory")).toBeInTheDocument();
		expect(screen.queryByText("Alice")).not.toBeInTheDocument();
	});

	it("handles bulk delete", async () => {
		const onBulkDelete = vi.fn();
		const selectionColumns: ColumnDef<TestData>[] = [
			{
				id: "select",
				header: ({ table }) => (
					<input
						type="checkbox"
						checked={table.getIsAllPageRowsSelected()}
						onChange={table.getToggleAllPageRowsSelectedHandler()}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<input
						type="checkbox"
						checked={row.getIsSelected()}
						onChange={row.getToggleSelectedHandler()}
						aria-label="Select row"
					/>
				),
			},
			...columns,
		];

		render(
			<DataTable
				columns={selectionColumns}
				data={data}
				onBulkDelete={onBulkDelete}
			/>,
		);

		const selectAll = screen.getByLabelText("Select all");
		await userEvent.click(selectAll);

		expect(screen.getByText("10 selected")).toBeInTheDocument();

		// Should find button by aria-label "Delete selected rows"
		const deleteBtn = screen.getByRole("button", {
			name: "Delete selected rows",
		});
		await userEvent.click(deleteBtn);

		expect(onBulkDelete).toHaveBeenCalled();
		expect(onBulkDelete.mock.calls[0][0]).toHaveLength(10);
	});
});
