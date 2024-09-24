import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verify } from "@/lib/auth";
export async function middleware(request) {
  const headersList = headers();
  let authToken = headersList.get("authorization");
  
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    try {
      let payload = await verify(authToken);
      if (!payload) {
        // If verification fails, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const headers = new Headers(request.headers);
      headers.set("address", payload);

      return NextResponse.next({
        request: {
          headers,
        },
      });
    } catch (error) {
      console.error("Authentication verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/api/user/"],
};
