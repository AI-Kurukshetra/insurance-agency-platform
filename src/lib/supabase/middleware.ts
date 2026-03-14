import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

const authRoutes = ["/login", "/register", "/forgot-password"];
const protectedPrefixes = [
  "/dashboard",
  "/clients",
  "/policies",
  "/quotes",
  "/claims",
  "/commissions",
  "/documents",
  "/tasks",
  "/leads",
  "/certificates",
  "/reports",
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  type CookieOptions = Parameters<typeof response.cookies.set>[2];
  type CookieToSet = {
    name: string;
    value: string;
    options?: CookieOptions;
  };

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach((cookie) => {
            const { name, value } = cookie;
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach((cookie) => {
            const { name, value, options } = cookie;
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const isAuthenticated = Boolean(claims);
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
