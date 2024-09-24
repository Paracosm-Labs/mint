import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verify } from "@/lib/auth";
export async function middleware(request) {
  const headersList = headers();
  let authToken = headersList.get("authorization");
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    let payload = await verify(authToken);

    const headers = new Headers(request.headers);
    headers.set("address", payload);

    return NextResponse.next({
      request: {
        headers,
      },
    });
  }
}
export const config = {
  matcher: ["/api/user/"],
};
