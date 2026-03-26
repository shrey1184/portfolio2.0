import { NextResponse, type NextRequest } from "next/server";

import { isAdminUser } from "@/lib/admin";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  if (!pathname.startsWith("/admin")) {
    return response;
  }

  if (pathname === "/admin/login") {
    if (isAdminUser(user?.email)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  if (!user || !isAdminUser(user.email)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
