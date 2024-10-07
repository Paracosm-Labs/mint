// api/deal/all/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/deal";

export async function GET() {
  try {
    await dbConnect();

    const deals = await Deal.find(); // Fetch all deals
    return NextResponse.json(deals, { status: 200 });
  } catch (error) {
    console.error("Error fetching all deals:", error);
    return NextResponse.json(
        { error: `Error fetching all deals: ${error}` },
        { status: 500 }
      );
  }
}
