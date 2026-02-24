import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    // Read token from cookie
    const token = request.cookies.get("token")?.value;

    const pathname = request.nextUrl.pathname;

    // Check if route starts with /admin
    const isAdminRoute = pathname.startsWith("/admin");

    // If user is not logged in and accessing admin route
    if (!token && isAdminRoute) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
}

// Apply middleware to all admin routes
export const config = {
    matcher: ["/admin/:path*"],
};