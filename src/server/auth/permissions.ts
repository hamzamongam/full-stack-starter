import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
	product: ["create", "list", "update", "delete"],
	category: ["create", "list", "update", "delete"],
	order: ["create", "list", "update", "delete"],
	media: ["create", "list", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
	user: ac.newRole({
		product: ["list"],
		category: ["list"],
		order: ["create", "list"], // Users can create and see their own orders
		media: ["list"],
	}),
	admin: ac.newRole({
		product: ["create", "list", "update", "delete"],
		category: ["create", "list", "update", "delete"],
		order: ["create", "list", "update", "delete"],
		media: ["create", "list", "update", "delete"],
		...adminAc.statements,
	}),
};
