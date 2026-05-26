import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl } = request;
  const isAuthenticated = Boolean(request.auth);
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = nextUrl.pathname === "/login";

  if (!isAuthenticated && isDashboardRoute) {
    const signInUrl = new URL("/login", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.href);
    return Response.redirect(signInUrl);
  }

  if (isAuthenticated && isLoginPage) {
    return Response.redirect(new URL("/dashboard", nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};