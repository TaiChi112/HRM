import { auth } from "@/auth";
import { Elysia } from "elysia";
import { hrController } from "../../../modules/hr/hr.controller";

const app = new Elysia({ prefix: "/api" })
	.derive(async () => {
		const session = await auth();

		return { session };
	})
	.onBeforeHandle(({ session, set }) => {
		if (!session?.user) {
			set.status = 401;
			return "Unauthorized";
		}
	})
	.use(hrController);

export type AppType = typeof app;

export const runtime = "nodejs";

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
