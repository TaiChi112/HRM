import { treaty } from "@elysiajs/eden";
import type { AppType } from "../app/api/[...elysia]/route";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const client = treaty<AppType>(getBaseUrl());
