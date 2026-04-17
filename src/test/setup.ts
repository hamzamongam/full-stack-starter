import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock Logger
vi.mock("@/lib/logger", () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		debug: vi.fn(),
	},
}));

// Mock Prisma
vi.mock("@/db/prisma", () => ({
	prisma: {
		school: {
			create: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			update: vi.fn(),
		},
		user: {
			update: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
		},
	},
}));

// Mock Better-Auth
vi.mock("@/server/auth", () => ({
	auth: {
		api: {
			signInEmail: vi.fn(),
			signUpEmail: vi.fn(),
			getSession: vi.fn(),
		},
	},
}));
