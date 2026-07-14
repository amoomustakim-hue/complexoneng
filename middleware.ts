import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/p/(.*)",
  "/g/(.*)",
  "/c/(.*)",
  "/become-a-mentor",
  "/about",
  "/founder",
  "/modules/(.*)",
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/whatsapp/(.*)",
  "/api/paystack/(.*)",
  "/api/public/(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
