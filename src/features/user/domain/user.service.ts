import type { UserRepository } from "./user.repo";

export class UserService {
	constructor(private repo: UserRepository) {}

	async getAll(input: { page: number; limit: number }) {
		return await this.repo.findAll(input);
	}
}
