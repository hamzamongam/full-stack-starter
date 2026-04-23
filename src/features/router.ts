import { authRouter } from "./auth/domain/auth.router";
import { MediaRouter } from "./media/domain/media.router";
import { TaskRouter } from "./task/domain/task.router";
import { UserRouter } from "./user/domain/user.router";

export const router = {
	task: TaskRouter,
	auth: authRouter,
	media: MediaRouter,
	user: UserRouter,
};
