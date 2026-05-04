import { NextResponse } from "next/server";
import { auth } from "./app/api/auth/[...nextauth]/auth";
import { PERMISSIONS, ROLE } from "./config/constant";
import routes from "./config/routes";
import { getRequiredPermission, resolvePermissions } from "./lib/permission-helper";
import { extractRoutes } from "./lib/utils";

// ── Route Classifiers ──────────────────────────────────────────────────────────

function isAdminRoute(pathname: string): boolean {
  const adminRoutes = extractRoutes(routes.privateRoutes.admin);
  return adminRoutes.some((route) => pathname.startsWith(route));
}

function isUserRoute(pathname: string): boolean {
  const userRoutes = extractRoutes(routes.privateRoutes.user);
  return userRoutes.some((route) => pathname.startsWith(route));
}

// ── Middleware ──────────────────────────────────────────────────────────────────

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const token = req?.auth?.user?.token;
  const role = (req?.auth?.user as any)?.role as string | undefined;

  const isAdmin = isAdminRoute(pathname);
  const isUser = isUserRoute(pathname);

  // ── 1. Admin Route Protection ─────────────────────────────────────────────

  if (isAdmin) {
    // Not authenticated → redirect to admin login
    if (!token) {
      const loginUrl = new URL(routes.publicRoutes.adminLogin, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated but wrong role → redirect to home
    if (role !== ROLE.ADMIN) {
      return NextResponse.redirect(new URL(routes.publicRoutes.home, req.url));
    }

    // Permission check for admin sub-routes
    const rawPermissions: string[] = (req?.auth?.user as any)?.permissions ?? ["ALL"];
    if (!rawPermissions.includes(PERMISSIONS.ALL)) {
      const requiredPermission = getRequiredPermission(pathname);
      if (requiredPermission) {
        const effectivePermissions = resolvePermissions(rawPermissions);
        if (!effectivePermissions.includes(requiredPermission)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    return NextResponse.next();
  }

  // ── 2. User Route Protection ──────────────────────────────────────────────

  if (isUser) {
    // Not authenticated → redirect to home with login hint
    if (!token) {
      const homeUrl = new URL(routes.publicRoutes.home, req.url);
      homeUrl.searchParams.set("login", "required");
      homeUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(homeUrl);
    }

    // Authenticated but wrong role → redirect to admin dashboard
    if (role === ROLE.ADMIN) {
      return NextResponse.redirect(new URL(routes.privateRoutes.admin.dashboard, req.url));
    }

    return NextResponse.next();
  }

  // ── 3. Admin Login Page Guard ─────────────────────────────────────────────

  if (pathname === routes.publicRoutes.adminLogin && token) {
    // Admin already logged in → go to dashboard
    if (role === ROLE.ADMIN) {
      return NextResponse.redirect(new URL(routes.privateRoutes.admin.dashboard, req.url));
    }
    // Customer on admin login page → go to home
    return NextResponse.redirect(new URL(routes.publicRoutes.home, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|fonts|default|$).*)"],
};
