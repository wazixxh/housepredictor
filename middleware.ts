export { default } from "next-auth/middleware";

// Any route matched here requires a valid session.
// Unauthenticated requests are redirected to /login automatically
// (configured via `pages.signIn` in lib/auth.ts).
export const config = {
  matcher: ["/dashboard/:path*", "/predictor/:path*"],
};
