import { treaty } from "@elysiajs/eden";
import type { AppType } from "../app/api/[...elysia]/route";

export const client = treaty<AppType>(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
);
