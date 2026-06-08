import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
     console.log(
        "path:",
        request.nextUrl.pathname,
        "token:",
        request.cookies.get("access_token")
    );

    const token = request.cookies.get("access_token"); // ← must match your backend's cookie name exactly
    const path = request.nextUrl.pathname;

    const guestRoutes = ["/login", "/register","/forgot","/forgot/verify"];

    if (token && guestRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && !guestRoutes.includes(path)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher:  ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};