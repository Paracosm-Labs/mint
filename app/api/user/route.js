// app/api/user/route.js
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import loadUserData from "@/lib/userData";

import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    const headersList = headers();
    const address = headersList.get("address");
    await dbConnect();
    let userData = await loadUserData(address);
    return NextResponse.json({ userData: userData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ club: "" }, { status: 500 });
  }
}
