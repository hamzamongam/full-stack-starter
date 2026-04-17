import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
	...defaultStatements,
	media: ["create", "list", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
	user: ac.newRole({
		media: ["list"],
	}),
	admin: ac.newRole({
		media: ["create", "list", "update", "delete"],
		...adminAc.statements,
	}),
};
