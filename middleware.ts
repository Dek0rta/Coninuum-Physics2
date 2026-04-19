import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n-routing";
import { auth } from "./lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/profile"];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Strip locale prefix to check protected paths
  const pathnameWithoutLocale = pathname.replace(/^\/(ru|en)/, "") || "/";
  const isProtected = protectedPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isProtected) {
    const session = await auth();
    if (!session) {
      const locale = pathname.match(/^\/(ru|en)/)?.[1] ?? "ru";
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
